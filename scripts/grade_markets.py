"""
grade_markets.py -- The Heat Sheet Market Grades Pipeline

Pulls every House, Senate, and Gubernatorial prediction market from Kalshi
(public API, no auth needed), grades each on liquidity, computes an adjusted
probability, converts to an implied margin, and maps to a rating
(Solid/Likely/Lean/Tossup).

Output: src/data/grades/YYYY-MM-DD.json + src/data/grades/latest.json

Usage:
    python scripts/grade_markets.py
"""

import sys
import json
import time
import datetime
from pathlib import Path
from statistics import NormalDist

import numpy as np
import pandas as pd
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
BASE_URL = "https://api.elections.kalshi.com/trade-api/v2"
MAX_REQUESTS_PER_SECOND = 10  # stay well under 20/s limit

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
KALSHI_IDS_PATH = SCRIPT_DIR / "kalshi_ids.csv"
OUTPUT_DIR = PROJECT_ROOT / "src" / "data" / "grades"

# Composite score weights (must sum to 1.0)
WEIGHT_VOLUME = 0.35
WEIGHT_SPREAD = 0.45
WEIGHT_OI = 0.20

# Last trade vs midpoint weight bounds
LAST_TRADE_WEIGHT_MIN = 0.35
LAST_TRADE_WEIGHT_MAX = 0.75

# Probability shrinkage exponent
SHRINKAGE_ALPHA = 1.25

# Election day
ELECTION_DAY = datetime.date(2026, 11, 3)

# Race type multipliers for margin conversion
MARGIN_MULT = {"H": 1.01, "G": 0.98, "S": 0.88, "P": 0.83}

# Margin -> rating thresholds
RATING_BREAKS = [
    (17, "Solid R"),
    (9, "Likely R"),
    (4, "Lean R"),
    (-4, "Tossup"),
    (-9, "Lean D"),
    (-17, "Likely D"),
]

CANDIDATE_PARTY_OVERRIDES = {"osborn": "I", "fischer": "R"}

# Auto-label threshold: if raw probability > this and market is too thin to
# properly rate, auto-assign Solid D/R
AUTO_SOLID_THRESHOLD = 80

# ---------------------------------------------------------------------------
# STATE NAMES
# ---------------------------------------------------------------------------
STATE_NAMES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
    "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
    "WI": "Wisconsin", "WY": "Wyoming",
}

CHAMBER_NAMES = {"H": "House", "S": "Senate", "G": "Governor"}


# ---------------------------------------------------------------------------
# HTTP SESSION (with retries + rate limiting)
# ---------------------------------------------------------------------------
_session = None
_last_request_time = 0.0
_min_interval = 1.0 / MAX_REQUESTS_PER_SECOND


def get_session():
    global _session
    if _session is None:
        _session = requests.Session()
        retry = Retry(
            total=5, backoff_factor=0.5,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=frozenset(["GET"]),
            raise_on_status=False,
        )
        adapter = HTTPAdapter(max_retries=retry)
        _session.mount("https://", adapter)
        _session.mount("http://", adapter)
    return _session


def rate_limited_get(path, params=None, timeout=25):
    """GET with rate limiting -- no auth needed for public endpoints."""
    global _last_request_time
    now = time.monotonic()
    wait = _min_interval - (now - _last_request_time)
    if wait > 0:
        time.sleep(wait)
    _last_request_time = time.monotonic()

    url = f"{BASE_URL}{path}"
    r = get_session().get(url, params=params, timeout=timeout)
    if r.status_code == 429:
        # Rate limited -- back off and retry once
        time.sleep(2.0)
        r = get_session().get(url, params=params, timeout=timeout)
    if r.status_code != 200:
        raise RuntimeError(f"GET {r.url} -> {r.status_code}: {r.text[:300]}")
    return r.json()


# ---------------------------------------------------------------------------
# KALSHI DATA PULL (public API)
# ---------------------------------------------------------------------------
def list_markets_for_event(event_ticker):
    out, params = [], {"event_ticker": event_ticker, "limit": 1000}
    while True:
        j = rate_limited_get("/markets", params=params)
        markets = j.get("markets", [])
        for m in markets:
            m["event_ticker"] = event_ticker
        out.extend(markets)
        cursor = j.get("cursor") or j.get("next_cursor") or j.get("next")
        if cursor:
            params["cursor"] = cursor
            continue
        if j.get("has_more") is True and not cursor:
            raise RuntimeError("API says has_more=true but returned no cursor.")
        break
    return out


def slugify(title):
    """Convert a series title to a URL slug."""
    import re
    s = title.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s.strip())
    s = re.sub(r"-+", "-", s)
    return s


def fetch_series_url(event_ticker):
    """Fetch the series info and build the Kalshi market URL for an event."""
    # Extract series ticker (event ticker without the trailing -NN)
    parts = event_ticker.rsplit("-", 1)
    series_ticker = parts[0] if len(parts) == 2 and parts[1].isdigit() else event_ticker
    try:
        j = rate_limited_get(f"/series/{series_ticker}")
        series = j.get("series", {})
        title = series.get("title", "")
        slug = slugify(title)
        return f"https://kalshi.com/markets/{series_ticker.lower()}/{slug}/{event_ticker.lower()}"
    except Exception:
        return None


def pull_all_markets(kalshi_ids):
    event_tickers = kalshi_ids["event_ticker"].dropna().astype(str).unique().tolist()
    race_event = kalshi_ids[["race_id", "event_ticker"]].dropna().drop_duplicates()
    # Build race_id -> event_ticker lookup for JSON output
    global _race_ticker_map, _race_url_map
    _race_ticker_map = dict(zip(race_event["race_id"], race_event["event_ticker"]))

    all_markets = []
    total = len(event_tickers)
    for i, et in enumerate(event_tickers):
        try:
            markets = list_markets_for_event(et)
            all_markets.extend(markets)
            if (i + 1) % 50 == 0 or (i + 1) == total:
                print(f"  [{i + 1}/{total}] events fetched, {len(all_markets)} contracts so far")
        except Exception as e:
            print(f"  [WARN] failed for {et}: {e}", file=sys.stderr)

    # Fetch series info to build proper Kalshi URLs
    print("Fetching series info for market URLs...")
    _race_url_map = {}
    seen_events = set()
    for rid, et in _race_ticker_map.items():
        if et in seen_events:
            _race_url_map[rid] = _race_url_map.get(
                next((r for r, e in _race_ticker_map.items() if e == et and r in _race_url_map), rid)
            )
            continue
        seen_events.add(et)
        url = fetch_series_url(et)
        _race_url_map[rid] = url

    markets_df = pd.DataFrame(all_markets)
    if markets_df.empty:
        print("No markets returned.", file=sys.stderr)
        sys.exit(1)

    return markets_df, race_event


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------
def extract_party(yes_sub_title):
    title_lower = str(yes_sub_title).lower()
    for candidate, party in CANDIDATE_PARTY_OVERRIDES.items():
        if candidate in title_lower:
            return party
    if "republican" in title_lower:
        return "R"
    elif "democratic" in title_lower:
        return "D"
    return None


def percentile_rank(value, all_values):
    if len(all_values) == 0:
        return 0.5
    count_below = sum(1 for v in all_values if v <= value)
    return count_below / len(all_values)


def compute_grade_thresholds(all_scores):
    """Compute grade cutoffs from the CDF of all liquidity scores.
    A = top 20%, B = 60-80th pct, C = 40-60th, D = 20-40th, F = bottom 20%."""
    scores = sorted([s for s in all_scores if not pd.isna(s)])
    if len(scores) == 0:
        return {80: 1.0, 60: 0.8, 40: 0.6, 20: 0.4}
    return {
        80: np.percentile(scores, 80),
        60: np.percentile(scores, 60),
        40: np.percentile(scores, 40),
        20: np.percentile(scores, 20),
    }


def composite_to_grade(score, thresholds):
    if pd.isna(score):
        return "F"
    if score >= thresholds[80]:
        return "A"
    if score >= thresholds[60]:
        return "B"
    if score >= thresholds[40]:
        return "C"
    if score >= thresholds[20]:
        return "D"
    return "F"


def margin_to_rating(margin):
    if pd.isna(margin):
        return None
    for threshold, rating in RATING_BREAKS:
        if margin >= threshold:
            return rating
    return "Solid D"


def parse_race_id(race_id):
    """Parse race_id like H2026AL01 into (chamber, state, district)."""
    prefix = race_id[0]
    state = race_id[5:7]
    district = race_id[7:]
    chamber = CHAMBER_NAMES.get(prefix, prefix)
    state_name = STATE_NAMES.get(state, state)

    if chamber == "House":
        label = f"{state}-{district.lstrip('0') or 'AL'}"
    else:
        label = state_name

    return chamber, state, state_name, label


# ---------------------------------------------------------------------------
# CORE: LIQUIDITY SCORING + ADJUSTED PROBABILITY
# ---------------------------------------------------------------------------
def compute_kalshi_probabilities(markets_df, kalshi_ids):
    df = markets_df.copy()
    df["party"] = df["yes_sub_title"].apply(extract_party)
    df = df[df["party"].notna()].copy()

    race_event = kalshi_ids[["race_id", "event_ticker"]].dropna().drop_duplicates()
    df = df.merge(race_event, on="event_ticker", how="left")
    df["race_type"] = df["race_id"].str[0]

    for col in ["yes_bid", "yes_ask", "last_price", "volume", "open_interest"]:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    df["has_two_sided"] = (df["yes_bid"] > 0) & (df["yes_ask"] > 0)
    df["spread"] = np.where(df["has_two_sided"], df["yes_ask"] - df["yes_bid"], np.nan)
    df["midpoint"] = np.where(
        df["has_two_sided"], (df["yes_bid"] + df["yes_ask"]) / 2, np.nan
    )
    df["is_stale"] = df["has_two_sided"] & (
        (df["last_price"] < df["yes_bid"]) | (df["last_price"] > df["yes_ask"])
    )

    # Percentile ranks within each race type
    for race_type in df["race_type"].unique():
        mask = df["race_type"] == race_type
        subset = df[mask]

        volumes = subset["volume"].tolist()
        ois = subset["open_interest"].tolist()
        inv_spreads = [
            1.0 / row["spread"] if pd.notna(row["spread"]) and row["spread"] > 0 else 0
            for _, row in subset.iterrows()
        ]

        df.loc[mask, "volume_pct"] = [percentile_rank(v, volumes) for v in subset["volume"]]
        df.loc[mask, "spread_pct"] = [
            percentile_rank(inv_spreads[i], inv_spreads) for i in range(len(inv_spreads))
        ]
        df.loc[mask, "oi_pct"] = [percentile_rank(o, ois) for o in subset["open_interest"]]

    df["composite"] = (
        WEIGHT_VOLUME * df["volume_pct"]
        + WEIGHT_SPREAD * df["spread_pct"]
        + WEIGHT_OI * df["oi_pct"]
    )

    weight_range = LAST_TRADE_WEIGHT_MAX - LAST_TRADE_WEIGHT_MIN
    df["last_trade_weight"] = LAST_TRADE_WEIGHT_MIN + (weight_range * df["composite"])

    def calc_prob(row):
        if row["last_price"] == 0 and row["volume"] == 0:
            return np.nan
        if not row["has_two_sided"]:
            return np.nan
        ltw = row["last_trade_weight"]
        mpw = 1.0 - ltw
        if row["is_stale"]:
            ltw = LAST_TRADE_WEIGHT_MIN
            mpw = 1.0 - ltw
            dist_bid = abs(row["last_price"] - row["yes_bid"])
            dist_ask = abs(row["last_price"] - row["yes_ask"])
            nearest = row["yes_bid"] if dist_bid < dist_ask else row["yes_ask"]
            return (ltw * nearest) + (mpw * row["midpoint"])
        else:
            return (ltw * row["last_price"]) + (mpw * row["midpoint"])

    df["probability"] = df.apply(calc_prob, axis=1)

    return df[
        [
            "race_id", "party", "probability", "composite",
            "volume", "open_interest", "spread", "has_two_sided",
            "volume_pct", "spread_pct", "oi_pct",
        ]
    ]


def get_republican_win_pct(kalshi_probs, markets_df, kalshi_ids):
    """
    Normalize probabilities and return Republican win % per race.
    Also returns raw_r_pct from market prices (for auto-Solid fallback on thin markets).
    """
    # Build raw R% from last_price for fallback
    mdf = markets_df.copy()
    mdf["party"] = mdf["yes_sub_title"].apply(extract_party)
    race_event = kalshi_ids[["race_id", "event_ticker"]].dropna().drop_duplicates()
    mdf = mdf.merge(race_event, on="event_ticker", how="left")
    mdf["last_price"] = pd.to_numeric(mdf["last_price"], errors="coerce").fillna(0)
    mdf["yes_bid"] = pd.to_numeric(mdf["yes_bid"], errors="coerce").fillna(0)

    raw_r = {}
    for race_id, group in mdf.groupby("race_id"):
        r_rows = group[group["party"] == "R"]
        if len(r_rows) > 0:
            row = r_rows.iloc[0]
            # Use last_price if available, else yes_bid
            price = row["last_price"] if row["last_price"] > 0 else row["yes_bid"]
            raw_r[race_id] = float(price)
        else:
            # Infer from D contract
            d_rows = group[group["party"] == "D"]
            if len(d_rows) > 0:
                d_row = d_rows.iloc[0]
                d_price = d_row["last_price"] if d_row["last_price"] > 0 else d_row["yes_bid"]
                raw_r[race_id] = float(100 - d_price)

    results = []
    for race_id, group in kalshi_probs.groupby("race_id"):
        valid = group[group["probability"].notna()]
        raw_r_pct = raw_r.get(race_id, np.nan)

        if len(valid) == 0:
            results.append({"race_id": race_id, "kalshi": np.nan, "kalshi_liq": np.nan,
                            "volume_pct": np.nan, "spread_pct": np.nan, "oi_pct": np.nan,
                            "raw_r_pct": raw_r_pct})
            continue

        total = valid["probability"].sum()
        if total <= 0:
            results.append({"race_id": race_id, "kalshi": np.nan, "kalshi_liq": np.nan,
                            "volume_pct": np.nan, "spread_pct": np.nan, "oi_pct": np.nan,
                            "raw_r_pct": raw_r_pct})
            continue

        normalized = valid.copy()
        normalized["prob_normalized"] = (normalized["probability"] / total) * 100
        liq = valid["composite"].mean()
        vol_pct = valid["volume_pct"].mean()
        spr_pct = valid["spread_pct"].mean()
        oi_pct_val = valid["oi_pct"].mean()

        rep_rows = normalized[normalized["party"] == "R"]
        if len(rep_rows) > 0:
            rep_pct = rep_rows["prob_normalized"].values[0]
        else:
            non_r = normalized[normalized["party"] != "R"]
            rep_pct = 100 - non_r["prob_normalized"].sum() if len(non_r) > 0 else np.nan

        results.append({"race_id": race_id, "kalshi": rep_pct, "kalshi_liq": liq,
                        "volume_pct": vol_pct, "spread_pct": spr_pct, "oi_pct": oi_pct_val,
                        "raw_r_pct": raw_r_pct})

    return pd.DataFrame(results)


# ---------------------------------------------------------------------------
# MARGIN CONVERSION + RATING
# ---------------------------------------------------------------------------
def compute_margins_and_ratings(df):
    """Convert adjusted probability to implied margin and rating."""
    nd = NormalDist()
    eps = 1e-4

    days = max((ELECTION_DAY - datetime.date.today()).days, 0)
    sd_house = ((days ** 0.6) / 3200.0) + 0.036

    # Shrinkage: push extremes toward 50%
    p = df["kalshi"] / 100
    alpha = SHRINKAGE_ALPHA
    p_shrunk = (p ** alpha) / (p ** alpha + (1 - p) ** alpha)
    df["kalshi_shrunk"] = p_shrunk * 100

    # Drop exact 0/100 after shrinkage
    df["kalshi_shrunk"] = np.where(
        (df["kalshi_shrunk"] <= 0) | (df["kalshi_shrunk"] >= 100),
        np.nan,
        df["kalshi_shrunk"],
    )

    p2 = (df["kalshi_shrunk"] / 100.0).clip(lower=eps, upper=1 - eps)
    z = p2.apply(lambda v: nd.inv_cdf(v) if pd.notna(v) else np.nan)

    race_prefix = df["race_id"].str[0]
    sigma = sd_house * race_prefix.map(MARGIN_MULT).fillna(1.0)

    df["margin"] = (z * sigma * 200).round().astype("Int64")
    df["rating"] = df["margin"].apply(margin_to_rating)

    return df


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
def main():
    kalshi_ids = pd.read_csv(KALSHI_IDS_PATH)

    print("Pulling markets from Kalshi (public API, no auth)...")
    markets_df, race_event = pull_all_markets(kalshi_ids)
    print(f"  {len(markets_df)} market contracts pulled.")

    print("Computing liquidity scores and adjusted probabilities...")
    kalshi_probs = compute_kalshi_probabilities(markets_df, kalshi_ids)
    results = get_republican_win_pct(kalshi_probs, markets_df, kalshi_ids)
    rated = results[results["kalshi"].notna()].copy()
    unrated = results[results["kalshi"].isna()].copy()
    print(f"  {len(rated)} races with full data, {len(unrated)} too thin to rate.")

    print("Computing margins and ratings...")
    rated = compute_margins_and_ratings(rated)

    # Compute grade thresholds from CDF of ALL liquidity scores (rated + unrated)
    all_liq_scores = list(rated["kalshi_liq"]) + list(unrated["kalshi_liq"].dropna())
    grade_thresholds = compute_grade_thresholds(all_liq_scores)
    print(f"  Grade cutoffs: A>={grade_thresholds[80]:.3f}  B>={grade_thresholds[60]:.3f}  "
          f"C>={grade_thresholds[40]:.3f}  D>={grade_thresholds[20]:.3f}  F=rest")

    # Build output for rated races
    today = datetime.date.today().isoformat()
    races = []
    for _, row in rated.iterrows():
        rid = row["race_id"]
        chamber, state_abbr, state_name, label = parse_race_id(rid)
        grade = composite_to_grade(row["kalshi_liq"], grade_thresholds)
        margin_val = int(row["margin"]) if pd.notna(row["margin"]) else None

        races.append({
            "race_id": rid,
            "event_ticker": _race_ticker_map.get(rid),
            "kalshi_url": _race_url_map.get(rid),
            "chamber": chamber,
            "state": state_abbr,
            "state_name": state_name,
            "label": label,
            "grade": grade,
            "liquidity_score": round(float(row["kalshi_liq"]), 3),
            "volume_pct": round(float(row["volume_pct"]), 3) if pd.notna(row["volume_pct"]) else None,
            "spread_pct": round(float(row["spread_pct"]), 3) if pd.notna(row["spread_pct"]) else None,
            "oi_pct": round(float(row["oi_pct"]), 3) if pd.notna(row["oi_pct"]) else None,
            "rating": row["rating"],
            "margin": margin_val,
        })

    # Auto-Solid fallback for unrated races where raw price > 80%
    auto_solid_count = 0
    for _, row in unrated.iterrows():
        rid = row["race_id"]
        raw_r = row.get("raw_r_pct", np.nan)
        if pd.isna(raw_r):
            continue

        if raw_r >= AUTO_SOLID_THRESHOLD:
            rating = "Solid R"
        elif raw_r <= (100 - AUTO_SOLID_THRESHOLD):
            rating = "Solid D"
        else:
            continue  # between 20-80%, too uncertain to auto-label

        chamber, state_abbr, state_name, label = parse_race_id(rid)
        liq = row["kalshi_liq"] if pd.notna(row["kalshi_liq"]) else 0.0
        grade = composite_to_grade(liq, grade_thresholds)

        races.append({
            "race_id": rid,
            "event_ticker": _race_ticker_map.get(rid),
            "chamber": chamber,
            "state": state_abbr,
            "state_name": state_name,
            "label": label,
            "grade": grade,
            "liquidity_score": round(float(liq), 3),
            "volume_pct": 0,
            "spread_pct": 0,
            "oi_pct": 0,
            "rating": rating,
            "margin": None,
        })
        auto_solid_count += 1

    print(f"  {auto_solid_count} thin markets auto-labeled Solid D/R.")

    # Sort: competitive races first (closest to Tossup), then by chamber
    chamber_order = {"Senate": 0, "Governor": 1, "House": 2}
    def sort_key(r):
        m = abs(r["margin"]) if r["margin"] is not None else 999
        return (chamber_order.get(r["chamber"], 9), m)
    races.sort(key=sort_key)

    output = {
        "date": today,
        "total_races": len(races),
        "races": races,
    }

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    dated_path = OUTPUT_DIR / f"{today}.json"
    latest_path = OUTPUT_DIR / "latest.json"

    with open(dated_path, "w") as f:
        json.dump(output, f, indent=2)
    with open(latest_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"Wrote {len(races)} races to {dated_path}")
    print(f"Wrote latest.json to {latest_path}")


if __name__ == "__main__":
    main()

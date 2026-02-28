---
title: "The Market Grades API"
date: "2026-02-28"
excerpt: "Our daily prediction market grades are now available as a free, public JSON API. Filter by chamber, state, grade, or rating -- from the terminal or your own code."
author: "Ryan McComb"
authorSlug: "ryanm"
category: "The Spread"
tags: ["Prediction Markets", "2026 Midterms"]
---

Not all prediction markets are created equal. A 62% for a Senate candidate backed by $400,000 in open interest and a one-cent spread is a fundamentally different signal than a 62% in a market with $800 and a spread you could drive a truck through. Our grading system answers a simple question: **how much should you trust this market's price?**

Every day, we pull data from Kalshi and score each House, Senate, and gubernatorial market on three dimensions -- volume, spread, and open interest -- then roll them into a single letter grade, A through F. An A means a deep, active, tight market where the price is a genuine signal. An F means the number displayed is close to meaningless. (For the full methodology, see [Your Local Market](/posts/your-local-market).)

Now you can access all of that data programmatically.

## The API

Our market grades are available as a free, public JSON API. No API key required. No rate limit (be reasonable). No authentication. Just fetch and go.

**Base URL:**

```
https://theheatsheet.com/api/grades
```

### Get latest grades

```bash
curl https://theheatsheet.com/api/grades
```

Returns all graded races for the most recent date, sorted by competitiveness.

### Filter by chamber

```bash
curl "https://theheatsheet.com/api/grades?chamber=senate"
```

Options: `senate`, `house`, `governor`.

### Filter by state

```bash
curl "https://theheatsheet.com/api/grades?state=IA"
```

Uses two-letter state abbreviations.

### Filter by grade

```bash
curl "https://theheatsheet.com/api/grades?grade=A"
```

Options: `A`, `B`, `C`, `D`, `F`.

### Filter by rating

```bash
curl "https://theheatsheet.com/api/grades?rating=tossup"
```

Options: `Tossup`, `Lean D`, `Lean R`, `Likely D`, `Likely R`, `Solid D`, `Solid R`.

### Filter by minimum liquidity

```bash
curl "https://theheatsheet.com/api/grades?min_liquidity=0.7"
```

Only returns races with a composite liquidity score at or above the threshold (0 to 1).

### Look up a single race

```bash
curl "https://theheatsheet.com/api/grades?race=S2026IA02"
```

Race IDs follow the format: `{chamber prefix}{year}{state}{district}`. Senate is `S`, House is `H`, Governor is `G`.

### Historical data

```bash
curl "https://theheatsheet.com/api/grades?date=2026-02-27"
```

Pull grades from a specific date. Use `?dates` to list all available dates:

```bash
curl "https://theheatsheet.com/api/grades?dates"
```

### Combine filters

Filters stack. Get all A-graded Senate tossups:

```bash
curl "https://theheatsheet.com/api/grades?chamber=senate&grade=A&rating=tossup"
```

## Response format

```json
{
  "date": "2026-02-28",
  "total": 34,
  "races": [
    {
      "race_id": "S2026IA02",
      "event_ticker": "SENATEIA-26",
      "kalshi_url": "https://kalshi.com/markets/senateia/...",
      "chamber": "Senate",
      "state": "IA",
      "state_name": "Iowa",
      "label": "Iowa",
      "grade": "A",
      "liquidity_score": 0.818,
      "volume_pct": 0.817,
      "spread_pct": 0.803,
      "oi_pct": 0.852,
      "rating": "Lean R",
      "margin": 5
    }
  ]
}
```

**Fields:**

- **race_id** -- Unique identifier (`S2026IA02` = Senate, 2026, Iowa, seat 02)
- **grade** -- Letter grade A through F based on composite liquidity
- **liquidity_score** -- Raw composite score from 0 to 1
- **volume_pct** -- Volume percentile rank within race type
- **spread_pct** -- Inverse spread percentile (higher = tighter spread)
- **oi_pct** -- Open interest percentile
- **rating** -- Implied competitiveness: Solid/Likely/Lean D or R, or Tossup
- **margin** -- Implied margin in percentage points (positive = R, negative = D)
- **kalshi_url** -- Direct link to the market on Kalshi

## Use cases

We built this because we wanted it ourselves. If you're a journalist fact-checking a prediction market citation, a campaign tracking market sentiment across competitive races, a researcher studying market quality, or just someone who wants to filter out the noise -- this is for you.

The data updates daily. This is not a forecast. We are grading the thermometer, not predicting the weather.

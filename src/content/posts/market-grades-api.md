---
title: "The Market Grades API"
date: "2026-02-28"
excerpt: "Our daily prediction market grades are now available as a free, public JSON API. Filter by chamber, state, grade, or rating -- from the terminal or your own code."
author: "Ryan McComb"
authorSlug: "ryanm"
category: "The Spread"
tags: ["Prediction Markets", "2026 Midterms"]
image: "/images/api-terminal-hero.svg"
---

We grade every House, Senate, and gubernatorial prediction market on Kalshi -- daily, A through F -- on volume, spread, and open interest. If you want to know what that means and why, read [Your Local Market](/posts/your-local-market).

This post is about the API. All of that data is now available as a free, public JSON endpoint. No API key. No authentication. No rate limit (be reasonable). Just fetch and go.

<div class="api-callout">
<h4>Base URL</h4>

```
https://theheatsheet.com/api/grades
```

</div>

<div class="api-callout">
<h4>Get latest grades</h4>

```bash
curl https://theheatsheet.com/api/grades
```

Returns all graded races for the most recent date, sorted by competitiveness.
</div>

<div class="api-callout">
<h4>Filter by chamber</h4>

```bash
curl "https://theheatsheet.com/api/grades?chamber=senate"
```

Options: `senate`, `house`, `governor`.
</div>

<div class="api-callout">
<h4>Filter by state</h4>

```bash
curl "https://theheatsheet.com/api/grades?state=IA"
```

Uses two-letter state abbreviations.
</div>

<div class="api-callout">
<h4>Filter by grade</h4>

```bash
curl "https://theheatsheet.com/api/grades?grade=A"
```

Options: `A`, `B`, `C`, `D`, `F`.
</div>

<div class="api-callout">
<h4>Filter by rating</h4>

```bash
curl "https://theheatsheet.com/api/grades?rating=tossup"
```

Options: `Tossup`, `Lean D`, `Lean R`, `Likely D`, `Likely R`, `Solid D`, `Solid R`.
</div>

<div class="api-callout">
<h4>Filter by minimum liquidity</h4>

```bash
curl "https://theheatsheet.com/api/grades?min_liquidity=0.7"
```

Only returns races with a composite liquidity score at or above the threshold (0 to 1).
</div>

<div class="api-callout">
<h4>Look up a single race</h4>

```bash
curl "https://theheatsheet.com/api/grades?race=S2026IA02"
```

Race IDs follow the format: `{chamber prefix}{year}{state}{district}`. Senate is `S`, House is `H`, Governor is `G`.
</div>

<div class="api-callout">
<h4>Historical data</h4>

```bash
curl "https://theheatsheet.com/api/grades?date=2026-02-27"
```

Pull grades from a specific date. Use `?dates` to list all available dates:

```bash
curl "https://theheatsheet.com/api/grades?dates"
```

</div>

<div class="api-callout">
<h4>Pretty-print for the terminal</h4>

Add `format=table` to any request and get a formatted ASCII table instead of JSON -- with box-drawing, liquidity bars, and percentile ranks:

```bash
curl "https://theheatsheet.com/api/grades?chamber=senate&format=table"
```

Works with every filter. Single race lookups get a detailed card:

```bash
curl "https://theheatsheet.com/api/grades?race=S2026IA02&format=table"
```

</div>

<div class="api-callout">
<h4>Combine filters</h4>

Filters stack. Get all A-graded Senate tossups as a table:

```bash
curl "https://theheatsheet.com/api/grades?chamber=senate&grade=A&rating=tossup&format=table"
```

</div>

## Response format

### JSON (default)

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

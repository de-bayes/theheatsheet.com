---
title: "Why We Grade Prediction Markets"
date: "2026-02-25"
excerpt: "A 62% on Kalshi doesn't mean the same thing as a 62% on Polymarket. Here's why market health matters — and how we measure it."
author: "The Heat Sheet"
category: "Methodology"
---

Prediction markets are having a moment. After a strong showing in the 2024 election cycle, platforms like Kalshi and Polymarket have become go-to sources for political probability estimates. Pundits cite them. Traders bet on them. And a growing number of analysts treat their prices as ground truth.

But here's the problem: not all markets are created equal.

## The Liquidity Problem

A contract trading at 62 cents on Kalshi might have $500,000 in open interest, tight bid-ask spreads, and hundreds of daily trades. Another contract, also at 62 cents, might have $2,000 in open interest, a 15-cent spread, and three trades this week. These are not the same signal.

The first market is telling you something real about how informed participants view the race. The second market is telling you that a handful of people placed some bets and nobody has bothered to arbitrage the price.

## Our Grading System

We built a proprietary model that evaluates political prediction markets across five dimensions:

1. **Liquidity** — Total open interest relative to comparable markets
2. **Volume** — Daily trading activity and trend
3. **Spread** — Bid-ask spread as a percentage of the contract price
4. **Price Discovery** — How quickly the market incorporates new information
5. **Convergence** — Whether the market's price aligns with peer markets for similar races

Each market receives a letter grade from A to F. An A-graded market has deep liquidity, tight spreads, high volume, and strong convergence. An F-graded market is thinly traded noise.

## Adjusted Probabilities

For every graded market, we also publish an adjusted probability that corrects for wide spreads and thin liquidity. If a market's midpoint is 62% but the spread is 10 cents, the "real" probability is somewhere between 57% and 67%. We use the market's health metrics to estimate where in that range the true signal likely falls.

## Why This Matters

If you're a trader, knowing which markets are healthy tells you where to deploy capital. If you're an analyst, it tells you which prices to trust. If you're a reader, it tells you which headlines about "the markets say X" to take seriously.

We'll be publishing our first round of market health grades soon. Stay tuned.

# {The Heat Sheet}

Nonpartisan political analysis. Race ratings, forecaster accountability, prediction market grades, and campaign finance research.

## Goal

The Heat Sheet is the essential reference for every competitive race in American politics. The name comes from competitive swimming — a heat sheet is the compact, data-rich document handed out before a meet listing every race, every competitor, and their seed times.

The site sits at the intersection of three worlds: qualitative race ratings (Cook, Sabato), quantitative model-based forecasting (the late FiveThirtyEight), and prediction market analysis. We publish race ratings with explicit probability estimates, grade decision desks and forecasters on accuracy and calibration, and evaluate prediction markets on health and reliability.

## Design Philosophy

**Keep it simple.** The articles, data tables, and interactive tools we publish will be complex enough on their own. The shell around them — navigation, layout, typography — should be as quiet and clean as possible so the content can do the work. We add complexity only when a specific piece of content demands it, not before.

- Cream background, charcoal text, one accent color (brand red)
- Two serif fonts: EB Garamond for body text, Cormorant Garamond for the logo
- No JavaScript-heavy UI frameworks, no component libraries — just Tailwind utility classes
- Markdown files for articles; no CMS until we outgrow the file system

## Architecture

```
src/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── layout.tsx          # Root layout: Header, main content, Footer
│   ├── page.tsx            # Home — article grid
│   ├── globals.css         # Tailwind layers & article-content styles
│   ├── about/              # Static about page
│   ├── archive/            # All articles
│   ├── subscribe/          # Newsletter signup (placeholder)
│   ├── race-ratings/       # Race ratings (placeholder)
│   ├── the-spread/         # Articles filtered by "The Spread" category
│   ├── decision-desk/      # Decision desk scorecards (placeholder)
│   └── posts/[slug]/       # Dynamic article pages
│
├── components/
│   ├── Header.tsx          # Top nav bar with desktop dropdown + mobile hamburger
│   ├── Footer.tsx          # Footer nav + copyright
│   ├── Logo.tsx            # Animated {THS} → {The Heat Sheet} on hover
│   ├── ArticleCard.tsx     # Post preview card (title, excerpt, date, author, category)
│   ├── NavDropdown.tsx     # Desktop dropdown for Projects menu
│   └── MobileNav.tsx       # Mobile hamburger menu
│
├── lib/
│   ├── posts.ts            # getAllPosts(), getPostBySlug(), getAllSlugs()
│   └── navigation.ts       # Nav item definitions and type guards
│
└── content/
    └── posts/              # Markdown files with YAML frontmatter
```

## Content

Articles are plain Markdown files in `src/content/posts/` with YAML frontmatter:

```yaml
---
title: Article Title
date: 2026-01-15
excerpt: A short description shown on cards.
author: Author Name
category: The Spread        # optional — used for section filtering
image: /images/example.jpg  # optional — shown on article cards
---

Article body in Markdown.
```

Posts are read at build time by `lib/posts.ts` using `gray-matter` for frontmatter and `remark` + `remark-html` for Markdown-to-HTML conversion. No database, no CMS.

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)  |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS 3.4                    |
| Content     | Markdown + gray-matter + remark     |
| Fonts       | Google Fonts (EB Garamond, Cormorant Garamond) |
| Deployment  | Vercel                              |

## Navigation

```
Header:
  {THS}  ·  Archive  ·  Projects ▾  ·  Subscribe  ·  About
                         ├─ Race Ratings
                         ├─ The Spread
                         └─ Decision Desk

Footer:
  {THS}    Archive · Race Ratings · The Spread · Decision Desk · Subscribe · About
           © 2026 The Heat Sheet. All rights reserved.
```

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
```

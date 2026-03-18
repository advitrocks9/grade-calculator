# jmc grade calculator

Grade calculator for Imperial JMC Year 1 (2025/26 cohort).

Covers all the maths and computing modules: Analysis, Calculus, Linear Algebra, IUM, Logic, Graphs & Algorithms, and Computing Practical. You put in your marks, it gives you your module grades, year average, classification, and tells you if you're on track to progress.

## What it does

- **Module grades**: enter marks as plain numbers or fractions (e.g. `52/60`), get weighted averages per module
- **Year average**: ECTS-weighted average across all modules with classification (First / 2:1 / 2:2 / Third)
- **Grade ranges**: shows your min and max possible grade based on what you haven't entered yet
- **Progression checker**: flags whether you're meeting all 10 progression requirements
- **What-if simulator**: play around with hypothetical marks to see how they'd affect your average
- **Target solver**: tells you what you need on remaining assessments to hit a target grade
- **Recovery codes**: 8-character code to get your grades back on a different device

Everything runs client-side with localStorage. There's optional Supabase sync but you don't need an account.

## Running locally

```bash
npm install
npm run dev
```

If you want Supabase sync, copy `.env.local.example` to `.env.local` and fill in your credentials. Otherwise it works fine without it.

## Stack

Next.js, TypeScript, Tailwind, Zustand, Supabase
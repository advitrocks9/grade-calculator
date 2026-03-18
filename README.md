# JMC Grade Hub

Grade calculator for Imperial JMC Year 1 (2025/26 cohort).

Tracks your assessment marks, computes weighted module grades and the ECTS-weighted year average, and checks whether you're on track for progression. There's also a what-if simulator for seeing how your remaining assessments affect your final average.

## Features

- Enter grades as plain numbers or fractions (e.g. 52/60)
- Weighted module averages with min/max possible ranges
- ECTS-weighted year average and classification
- Progression requirement checker (all 10 requirements)
- What-if simulator for unentered assessments
- Recovery codes to restore grades on another device

## Setup

```bash
npm install
```

Copy `.env.local.example` to `.env.local` and add your Supabase credentials.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

Next.js, TypeScript, Tailwind CSS, Zustand, Supabase

## Notes

This is unofficial and not affiliated with Imperial or the JMC department. Module weights are taken from the 2025/26 handbook but may not be perfectly accurate. Don't rely on this for anything important.

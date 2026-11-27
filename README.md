# Time & Energy Audit

Where does my day actually go – and what gives me energy, what drains it? A fast mobile app to log your day in 30-minute blocks and analyze it.

**Live:** https://time-and-energy-audit.vercel.app

## Features
- **Day starts at wake-up**: the timeline builds from the moment you get up, even past midnight.
- **One-tap logging**: pick an activity, rate its value ($ / $$ / $$$) and mark its energy (gives / drains).
- **Edit blocks**: tap a block, change it live, extend it with +/−; identical neighbors merge automatically.
- **Analysis** by day and week: share of high-impact work, time per activity, energy balance, average wake-up time.

## Tech
- Vanilla HTML, CSS and JavaScript, no build step, mobile-first
- Data stays local in the browser (localStorage)
- Hosted on Vercel

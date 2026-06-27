# TaxMind Nexus

**Agentic Tax Intelligence Platform — Full Source Code**

A complete, production-ready SaaS template built for tax practices. Comes with 40+ pages, six integrated modules, and a full Vite + React 19 + TypeScript stack. Buy it once, own it forever, ship it as your own product or use it as a foundation for client work.

**Live demo:** [https://taxmind-nexus.vercel.app](https://taxmind-nexus.vercel.app)

---

## What you get

Six fully built modules, all wired together and running on real in-memory state:

### Client Management
- Client list with search and filter
- Detail page with engagement history, entity type, and fiscal year
- Sub-pages for returns, planning notes, and documents

### Tax Return Workflow
- Pipeline view with status tracking (Not Started, In Progress, Under Review, Filed)
- Per-return workpaper panel
- Estimate calculator with quarterly projection
- Tax analysis charts

### Research Library
- Memo creation with rich-text editor
- IRC browser (Internal Revenue Code reference)
- Research detail view with citation linking

### Planning Tools — Eight calculators
- Entity comparison (LLC vs S-Corp vs C-Corp)
- Depreciation (MACRS + bonus)
- Individual tax planner
- Retirement contribution window
- Capital gains estimator
- QBI deduction (§199A)
- Home office deduction
- Year-end tax projection

### SALT and International
- Nexus analysis dashboard
- Apportionment schedule builder
- State conformity tracker
- GILTI calculator
- FBAR obligation tracker

### Controversy Management
- Notice tracking board
- Audit timeline with statute of limitations countdown
- Document attachment panel
- Protest deadline reminders

### Firm Analytics
- Return production dashboard
- Deadline calendar
- Pipeline bottleneck view

### AI Agents Panel
- Agent status cards
- Per-agent detail view with conversation history
- Built-in scaffold for connecting to any LLM API

### Landing Page
- Fully animated marketing page
- Particle field background
- 3D tilt cards, magnetic buttons, scroll reveal
- Floating dashboard mockup
- Animated stat counters, typewriter, pricing section
- Sticky navbar with blur effect on scroll

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 3 + custom design tokens |
| State | Zustand 5 |
| Routing | React Router 7 |
| Charts | Recharts 2 |
| Animations | Framer Motion 12 |
| UI primitives | shadcn/ui (Radix-based) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| Date handling | date-fns 4 |
| Math | mathjs |

---

## Quick start

```bash
# Clone or extract the ZIP
cd taxmind-nexus

# Install dependencies
npm install --legacy-peer-deps

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser. The app seeds demo data automatically on first load — you will see a populated dashboard with clients, returns, and memos ready to explore.

### Build for production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
vercel --yes --prod
```

The included vercel.json handles SPA routing rewrites automatically.

---

## Folder structure

```
src/
  components/
    layout/          # Topbar, Sidebar, AppLayout
    ui/              # 40+ shadcn/ui primitives
  data/
    seedData.ts      # Demo data - clients, returns, memos
    taxDeadlines.ts  # 2025 filing deadlines
    ircSections.ts   # IRC reference data
  hooks/             # Custom React hooks
  lib/               # Utility functions
  pages/
    Dashboard.tsx
    LandingPage.tsx
    agents/          # AI Agents module
    analytics/       # Firm analytics + deadline calendar
    clients/         # Client management
    controversy/     # IRS notice tracking
    estate/          # Estate and gift planning
    international/   # GILTI, FBAR
    planning/        # Eight planning calculators
    research/        # Research library + IRC browser
    returns/         # Return workflow
    salt/            # SALT modules
    SettingsPage.tsx
  router.tsx         # All 40+ routes defined here
  stores/            # Zustand stores per module
  index.css          # Design system tokens
```

---

## Customization

**Brand colors** — all color tokens live in src/index.css as CSS custom properties. Change --brand, --brand-mid, and the semantic tax colors to match your client identity.

**Seed data** — src/data/seedData.ts controls the demo clients, returns, and memos. Replace with your own or remove the seedAllData() call in src/App.tsx to start with a clean slate.

**AI integration** — the Agents module is scaffolded but does not include a hardcoded API key. Drop in any OpenAI, Anthropic, or Groq call inside src/pages/agents/AgentDetail.tsx.

---

## License

Single-use commercial license. You may use this codebase in one production project or resell it as part of a client deliverable. You may not redistribute or resell the source code itself.

---

## Support

Found a bug or need help setting up? Email the address on the Gumroad product page. Response time is typically within 24 hours on weekdays.

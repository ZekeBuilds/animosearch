# AnimoSearch

A thesis and research discovery platform for De La Salle University. Browse, search, and explore DLSU theses and dissertations sourced from the Animo Repository.

**Live site:** https://animosearch.vercel.app

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with featured thesis carousel and college overview |
| Theses | `/theses` | Browse all 1,092 theses with search, filters, and pagination |
| Thesis Detail | `/theses/:slug` | Full thesis info with abstract, authors, citation panel, and Animo Repository link |
| Colleges | `/colleges` | Browse theses by DLSU college |
| Writing Guide | `/writing-guide` | Step-by-step guide to writing a thesis |
| Research Planner | `/planner` | Plan and track your research timeline |
| Checklist | `/checklist` | Thesis submission checklist |
| Showcase | `/showcase` | Featured recent theses (2020-2024) |
| Quiz | `/quiz` | Research topic quiz |
| Thesis Budget | `/budget` | Budget planner for thesis expenses |
| Submit | `/submit` | Submit a thesis for inclusion |
| About | `/about` | About the project and team |
| Trends | `/trends` | Data visualizations: publications by year, college output, top keywords, heatmap |
| Topic Map | `/topic-map` | Interactive d3 bubble chart of research keywords by college |
| Gap Finder | `/gap-finder` | AI-powered research gap analysis by college and department |

---

## Tech Stack

**Frontend**
- React 19
- Vite 8
- Tailwind CSS v4 (CSS-first config via `@theme` block, no `tailwind.config.js`)
- React Router DOM v7
- @tanstack/react-query v5
- AOS v2.3 (scroll animations)
- Lucide React (icons)
- react-helmet-async (SEO meta tags)
- Recharts (Trends charts)
- D3 (Topic Map bubble visualization)

**Backend / Data**
- Supabase (PostgreSQL) — 1,092 thesis records, RLS enabled
- Supabase Edge Function `chat` — AI chatbot powered by Groq (llama-3.1-8b-instant)
- Supabase Edge Function `gap-finder` — AI research gap analysis powered by Groq
- Data sourced from DLSU Animo Repository via OAI-PMH API

**Dev Tools**
- ESLint 9
- @vitejs/plugin-react

---

## Design System

| Token | Value |
|---|---|
| Primary (DLSU Green) | `#005E3A` |
| Secondary (Gold) | `#FFB81C` |
| Accent (Navy) | `#1B4F72` |
| Background | `#F4F9F4` |
| Ink | `#1A1A2E` |
| Heading font | Cormorant Garamond |
| Body font | Outfit |
| Label font | Josefin Sans |
| Stat font | Fraunces |

Dark mode is supported via Tailwind's `.dark` class strategy, toggled from the navbar and persisted in `localStorage` under the key `animosearch-theme`.

---

## Features

- Search and filter 1,092 DLSU theses by title, author, abstract, college, department, year, and degree level
- All thesis records link directly to the real Animo Repository
- Inline citation panel on each thesis (APA, IEEE, Chicago — one-click copy)
- AI chatbot (bottom-right bubble) — answers questions about the site and searches the thesis database
- AI research gap finder — identifies 5 underresearched topics for a given college and department
- Research Trends page with area charts, bar charts, keyword rankings, and a college-year heatmap
- Interactive Topic Map — d3 bubble visualization of top keywords, filterable by college
- Chatbot and gap finder both rate-limited to 10 requests/min per IP server-side
- Fully responsive — mobile, tablet, and desktop
- Dark mode
- Client-side pagination (20 theses per page)

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Requires a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Project Structure

```
src/
  components/       Navbar, Footer, ChatWidget
  pages/            15 page components
  lib/              supabaseClient.js, thesesApi.js
  data/             colleges.js, quizQuestions.js, checklistItems.js, guideContent.js
supabase/
  functions/
    chat/           Edge Function (Groq AI chatbot)
    gap-finder/     Edge Function (Groq AI research gap analysis)
```

---

## Course

LBYCPG3 — De La Salle University

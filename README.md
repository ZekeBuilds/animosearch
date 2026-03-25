# AnimoSearch

A thesis and research discovery platform for De La Salle University. Browse, search, and explore DLSU theses and dissertations sourced from the Animo Repository.

**Live site:** https://animosearch.vercel.app

---

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page with featured thesis carousel and college overview |
| Theses | `/theses` | Browse all 231 theses with search, filters, and pagination |
| Thesis Detail | `/thesis/:slug` | Full thesis info with abstract, authors, and Animo Repository link |
| Colleges | `/colleges` | Browse theses by DLSU college |
| Writing Guide | `/writing-guide` | Step-by-step guide to writing a thesis |
| Research Planner | `/planner` | Plan and track your research timeline |
| Checklist | `/checklist` | Thesis submission checklist |
| Showcase | `/showcase` | Featured recent theses (2020-2024) |
| Quiz | `/quiz` | Research topic quiz |
| Thesis Budget | `/budget` | Budget planner for thesis expenses |
| Submit | `/submit` | Submit a thesis for inclusion |
| About | `/about` | About the project and team |

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

**Backend / Data**
- Supabase (PostgreSQL) — 231 thesis records, RLS enabled
- Supabase Edge Function — AI chatbot powered by Groq (llama-3.1-8b-instant)
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

- Search and filter 231 DLSU theses by title, college, department, year, and degree level
- All thesis records link directly to the real Animo Repository
- AI chatbot (bottom-right bubble) — answers questions about the site and searches the thesis database
- Chatbot rate-limited to 10 requests/min per IP server-side
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
  pages/            12 page components
  lib/              supabaseClient.js, thesesApi.js
  data/             colleges.js, quizQuestions.js, checklistItems.js, guideContent.js
supabase/
  functions/chat/   Edge Function (Groq AI chatbot)
```

---

## Course

LBYCPG3 — De La Salle University

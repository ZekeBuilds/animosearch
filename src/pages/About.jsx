import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Github, Code2, Database, Globe, Layers, Palette, ExternalLink } from 'lucide-react'

const TECH_STACK = [
  { icon: Code2, name: 'React 19 + Vite', role: 'Component-based UI + fast dev server with lazy loading' },
  { icon: Palette, name: 'Tailwind CSS v4', role: 'Utility-first styling with custom DLSU design tokens' },
  { icon: Globe, name: 'React Router DOM v7', role: 'Client-side SPA navigation (16 routes)' },
  { icon: Database, name: 'Supabase', role: 'Thesis database + community submission form' },
  { icon: Layers, name: '@tanstack/react-query', role: 'Data fetching, caching, and loading states' },
  { icon: Code2, name: 'AOS + Lucide React', role: 'Scroll animations + SVG icon library' },
]

const FEATURES = [
  'Browse 1,092 real DLSU theses from the Animo Repository OAI-PMH API',
  'Full-text search by title, author, abstract, and keywords',
  'Filter by college, degree level, and year range',
  'Thesis detail pages with abstract, keywords, and Animo Repository link',
  'College and department drill-down with thesis counts',
  'Step-by-step thesis writing guide with accordion FAQ sections',
  'Milestone-based research planner with localStorage persistence',
  'Thesis submission requirements checklist with progress tracking',
  'Thesis budget estimator with customizable cost categories',
  'DLSU and research trivia quiz with score tiers and high score',
  'Research showcase featuring notable theses with abstract lightbox',
  'Community submission form — add missing theses to the database',
  'Dark mode with localStorage persistence',
  'Responsive design tested at 375px, 768px, 1024px, and 1440px',
  'Accessible: ARIA labels, focus states, semantic HTML, keyboard navigation',
  'Web Share API with clipboard fallback on thesis detail pages',
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — AnimoSearch</title>
        <meta name="description" content="About AnimoSearch — a DLSU thesis and research discovery platform built for LBYCPG3. Data from the Animo Repository, tech stack, and features." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">About This Site</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>AnimoSearch</h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            A thesis and research discovery platform for De La Salle University students. Built as the LBYCPG3 final project.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14]">
        <div className="container-lg py-12 space-y-16">

          {/* Purpose */}
          <section data-aos="fade-up">
            <span className="section-label">Purpose</span>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Why AnimoSearch?</h2>
            <div className="max-w-3xl space-y-4 text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed text-[0.9375rem]">
              <p>
                AnimoSearch is a thesis discovery and research guidance platform built on real data from DLSU's Animo Repository. The goal is to give DLSU students a fast, searchable way to find existing research in their field, understand what has been studied before, and identify genuine research gaps.
              </p>
              <p>
                Beyond search, AnimoSearch includes practical tools for every stage of the thesis journey: a writing guide, a milestone planner, a submission checklist, and a budget estimator. The platform was built as the final output for LBYCPG3, demonstrating full-stack front-end development with React, Supabase, and a real institutional data source.
              </p>
            </div>
          </section>

          {/* Data source */}
          <section data-aos="fade-up">
            <span className="section-label">Data Attribution</span>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Animo Repository</h2>
            <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 max-w-2xl">
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed mb-4">
                All thesis metadata on AnimoSearch is sourced from the{' '}
                <a href="https://animorepository.dlsu.edu.ph" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)] cursor-pointer">
                  Animo Repository
                </a>
                {' '}— DLSU's institutional digital library — via its publicly accessible OAI-PMH API endpoint. Records include titles, authors, abstracts, keywords, departments, and degree levels as published by the repository.
              </p>
              <a
                href="https://animorepository.dlsu.edu.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-label text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] cursor-pointer transition-colors"
              >
                Visit Animo Repository <ExternalLink size={12} aria-hidden="true" />
              </a>
            </div>
          </section>

          {/* Tech Stack */}
          <section data-aos="fade-up">
            <span className="section-label">Built With</span>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-6">Tech Stack</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TECH_STACK.map(({ icon: Icon, name, role }) => (
                <div key={name} className="bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-4 border border-[var(--color-border-light)] dark:border-white/10 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[var(--color-primary)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--color-ink)] dark:text-white mb-0.5">{name}</p>
                    <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 leading-relaxed">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section data-aos="fade-up">
            <span className="section-label">What's Included</span>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-6">Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              {FEATURES.map(f => (
                <li key={f} className="flex items-start gap-3 bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-3.5 border border-[var(--color-border-light)] dark:border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] flex-shrink-0 mt-1.5" aria-hidden="true" />
                  <span className="text-sm text-[var(--color-ink)] dark:text-white/80">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* GitHub CTA */}
          <section data-aos="fade-up">
            <div className="bg-[var(--color-ink)] dark:bg-[#080F0D] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-white mb-2">View on GitHub</h3>
                <p className="text-white/60 text-sm">Full source code, commit history, and documentation for the LBYCPG3 final project.</p>
              </div>
              <a
                href="https://github.com/your-username/animosearch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-ink)] rounded-full font-label text-xs font-semibold hover:bg-[var(--color-sky-bg)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Github size={16} aria-hidden="true" /> View Repository
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

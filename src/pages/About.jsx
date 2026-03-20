import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Github, Code2, Database, Globe, Layers, Palette } from 'lucide-react'

const TECH_STACK = [
  { icon: Code2, name: 'React 19 + Vite', role: 'Component-based UI + fast dev server' },
  { icon: Palette, name: 'Tailwind CSS v4', role: 'Utility-first styling with custom design tokens' },
  { icon: Globe, name: 'React Router DOM v7', role: 'Client-side SPA navigation (12 routes)' },
  { icon: Database, name: 'Supabase', role: 'Destinations database + trip inquiry form' },
  { icon: Layers, name: '@tanstack/react-query', role: 'Data fetching, caching, and loading states' },
  { icon: Code2, name: 'AOS + Lucide React', role: 'Scroll animations + SVG icon library' },
]

const FEATURES = [
  'Destinations explorer with live filter by island group, activity, and budget',
  'Destination detail pages with photo gallery, things-to-do, and how-to-get-there',
  'Interactive regions map with island group selector and region breakdown',
  'Comprehensive travel tips with accordion FAQ sections',
  'Day-by-day itinerary builder with localStorage persistence',
  'Interactive packing checklist with progress tracking',
  'Philippines travel quiz with 10 trivia questions and score tiers',
  'Photo gallery with masonry layout and keyboard-navigable lightbox',
  'Budget estimator with multi-factor cost calculation',
  'Trip inquiry form with Supabase integration and client-side validation',
  'Dark mode with system preference detection and localStorage persistence',
  'Responsive design — tested at 375px, 768px, 1024px, and 1440px',
  'Accessible: ARIA labels, focus states, semantic HTML, keyboard navigation',
  'Web Share API with clipboard fallback on destination detail pages',
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About — Lakbay PH</title>
        <meta name="description" content="About Lakbay PH — a Philippine travel discovery website built for LBYCPG3. Tech stack, features, and acknowledgements." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">About This Site</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Lakbay PH</h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            A Philippine travel discovery website built as the LBYCPG3 final project. Designed to inspire, inform, and help travelers plan their adventures across the 7,641 islands.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923]">
        <div className="container-lg py-12 space-y-16">

          {/* Purpose */}
          <section data-aos="fade-up">
            <span className="section-label">Purpose</span>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Why Lakbay PH?</h2>
            <div className="max-w-3xl space-y-4 text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed text-[0.9375rem]">
              <p>
                "Lakbay" means "journey" in Filipino — a fitting name for a site dedicated to inspiring travel across one of the world's most beautiful and diverse archipelagos. This project was built as the final output for LBYCPG3, demonstrating front-end development skills including React component architecture, responsive design, JavaScript interactivity, and backend integration via Supabase.
              </p>
              <p>
                The Philippines is a destination that deserves better digital representation. This site aims to go beyond generic travel aggregators and offer genuinely useful tools — from a day-planner to a packing checklist to a budget estimator — all designed with the actual traveler experience in mind.
              </p>
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

          {/* Credits */}
          <section data-aos="fade-up">
            <span className="section-label">Acknowledgements</span>
            <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Image Credits</h2>
            <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 max-w-2xl">
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed mb-4">
                All photographs used on this site are sourced from{' '}
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)] cursor-pointer">
                  Unsplash
                </a>{' '}
                under their free-to-use license. Unsplash photos are free to use for commercial and non-commercial purposes under the Unsplash License.
              </p>
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">
                Destination information was compiled from publicly available tourism resources, Wikipedia, and the official Philippine tourism website (tourism.gov.ph). All content is intended for educational and demonstration purposes.
              </p>
            </div>
          </section>

          {/* GitHub CTA */}
          <section data-aos="fade-up">
            <div className="bg-[var(--color-ink)] dark:bg-[#0F0F17] rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-display font-bold text-xl text-white mb-2">View on GitHub</h3>
                <p className="text-white/60 text-sm">Full source code, commit history, and documentation for the LBYCPG3 final project.</p>
              </div>
              <a
                href="https://github.com/your-username/lakbay-ph"
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

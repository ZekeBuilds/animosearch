import { Link } from 'react-router-dom'
import { BookOpen, Github, Mail, ExternalLink, Heart } from 'lucide-react'

const DISCOVER_LINKS = [
  { to: '/theses', label: 'Browse Theses' },
  { to: '/colleges', label: 'Colleges & Departments' },
  { to: '/showcase', label: 'Research Showcase' },
  { to: '/quiz', label: 'Research Quiz' },
]

const TOOLS_LINKS = [
  { to: '/planner', label: 'Research Planner' },
  { to: '/checklist', label: 'Requirements Checklist' },
  { to: '/budget', label: 'Thesis Budget' },
  { to: '/guide', label: 'Writing Guide' },
]

const INFO_LINKS = [
  { to: '/about', label: 'About AnimoSearch' },
  { to: '/submit', label: 'Submit / Contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-[var(--color-ink)] dark:bg-[#080F0D] text-white/80"
      role="contentinfo"
    >
      {/* Wave separator */}
      <div className="overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          aria-hidden="true"
          preserveAspectRatio="none"
          style={{ height: '48px' }}
        >
          <path
            d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z"
            fill="var(--color-sky-bg)"
            className="dark:fill-[#0D1F14]"
          />
        </svg>
      </div>

      <div className="container-lg py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] rounded-md"
              aria-label="AnimoSearch — Home"
            >
              <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                <BookOpen size={15} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Animo<span className="text-[var(--color-secondary)]">Search</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Discover DLSU research. Start your own. Explore theses and dissertations from De La Salle University's Animo Repository.
            </p>

            {/* External links */}
            <div className="space-y-2">
              <a
                href="https://animorepository.dlsu.edu.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-white/50 hover:text-[var(--color-secondary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-secondary)]"
              >
                <ExternalLink size={12} aria-hidden="true" />
                Animo Repository
              </a>
              <a
                href="https://www.dlsu.edu.ph"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-white/50 hover:text-[var(--color-secondary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-secondary)]"
              >
                <ExternalLink size={12} aria-hidden="true" />
                DLSU Official Website
              </a>
            </div>
          </div>

          {/* Discover links */}
          <div>
            <h3 className="font-label text-xs tracking-wider uppercase text-[var(--color-secondary)] mb-4">
              Discover
            </h3>
            <ul className="space-y-2.5" role="list">
              {DISCOVER_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-secondary)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools links */}
          <div>
            <h3 className="font-label text-xs tracking-wider uppercase text-[var(--color-secondary)] mb-4">
              Research Tools
            </h3>
            <ul className="space-y-2.5" role="list">
              {TOOLS_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-secondary)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info + Contact */}
          <div>
            <h3 className="font-label text-xs tracking-wider uppercase text-[var(--color-secondary)] mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 mb-6" role="list">
              {INFO_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-secondary)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" />
                <span>animosearch@dlsu.edu.ph</span>
              </div>
              <div className="flex items-center gap-2">
                <Github size={14} aria-hidden="true" />
                <span>LBYCPG3 Final Project</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            &copy; {year} AnimoSearch. Built for LBYCPG3 Final Project.
          </p>
          <p className="flex items-center gap-1.5">
            Data from{' '}
            <a
              href="https://animorepository.dlsu.edu.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/70 transition-colors cursor-pointer"
            >
              Animo Repository
            </a>
            {' '}· Made with <Heart size={12} className="text-[var(--color-secondary)]" aria-hidden="true" /> for DLSU
          </p>
        </div>
      </div>
    </footer>
  )
}

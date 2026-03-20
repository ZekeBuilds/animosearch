import { Link } from 'react-router-dom'
import { MapPin, Instagram, Facebook, Youtube, Twitter, Mail, Phone, Heart } from 'lucide-react'

const EXPLORE_LINKS = [
  { to: '/destinations', label: 'All Destinations' },
  { to: '/regions', label: 'Regions Explorer' },
  { to: '/gallery', label: 'Photo Gallery' },
  { to: '/quiz', label: 'PH Travel Quiz' },
]

const TOOLS_LINKS = [
  { to: '/itinerary', label: 'Itinerary Builder' },
  { to: '/packing', label: 'Packing Checklist' },
  { to: '/budget', label: 'Budget Estimator' },
  { to: '/tips', label: 'Travel Tips' },
]

const INFO_LINKS = [
  { to: '/about', label: 'About This Site' },
  { to: '/contact', label: 'Trip Inquiry' },
]

const SOCIAL = [
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Twitter, label: 'X / Twitter', href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-[var(--color-ink)] dark:bg-[#080F17] text-white/80"
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
            className="dark:fill-[#0F1923]"
          />
        </svg>
      </div>

      <div className="container-lg py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-2 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-md"
              aria-label="Lakbay PH — Home"
            >
              <span className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                <MapPin size={15} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                Lakbay<span className="text-[var(--color-secondary)]"> PH</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Your gateway to discovering the best of the Philippines — 7,641 islands of wonder, culture, and natural beauty.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3" role="list" aria-label="Social media links">
              {SOCIAL.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={href === '#' ? (e) => e.preventDefault() : undefined}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[var(--color-primary)] flex items-center justify-center transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                  role="listitem"
                >
                  <Icon size={16} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="font-label text-xs tracking-wider uppercase text-[var(--color-accent)] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5" role="list">
              {EXPLORE_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools links */}
          <div>
            <h3 className="font-label text-xs tracking-wider uppercase text-[var(--color-accent)] mb-4">
              Travel Tools
            </h3>
            <ul className="space-y-2.5" role="list">
              {TOOLS_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info + Contact */}
          <div>
            <h3 className="font-label text-xs tracking-wider uppercase text-[var(--color-accent)] mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 mb-6" role="list">
              {INFO_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:text-[var(--color-accent)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Mail size={14} aria-hidden="true" />
                <span>hello@lakbayphtravel.ph</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} aria-hidden="true" />
                <span>+63 (2) 8XXX XXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>
            &copy; {year} Lakbay PH. Built for LBYCPG3 Final Project.
          </p>
          <p className="flex items-center gap-1.5">
            Made with <Heart size={12} className="text-[var(--color-secondary)]" aria-hidden="true" /> in the Philippines.
            Photos from{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/70 transition-colors cursor-pointer"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Sun, Moon, Menu, X, ChevronDown, MapPin } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/regions', label: 'Regions' },
  { to: '/tips', label: 'Travel Tips' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

const TOOLS_LINKS = [
  { to: '/itinerary', label: 'Itinerary Builder' },
  { to: '/packing', label: 'Packing List' },
  { to: '/budget', label: 'Budget Estimator' },
  { to: '/quiz', label: 'PH Quiz' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.classList.contains('dark')
  )
  const toolsRef = useRef(null)
  const location = useLocation()

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setToolsOpen(false)
  }, [location.pathname])

  // Close tools dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.classList.toggle('dark', next)
    try { localStorage.setItem('lakbay-theme', next ? 'dark' : 'light') } catch {}
  }

  const isToolsActive = TOOLS_LINKS.some(l => location.pathname === l.to)

  const navBg = scrolled || mobileOpen
    ? 'bg-white/95 dark:bg-[#0F1923]/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)]'
    : 'bg-transparent'

  const linkColor = scrolled || mobileOpen
    ? 'text-[var(--color-ink)] dark:text-[#E8F4FD]'
    : 'text-white'

  const activeStyle = scrolled || mobileOpen
    ? 'text-[var(--color-primary)] dark:text-[var(--color-accent)]'
    : 'text-white underline underline-offset-4 decoration-[var(--color-secondary)]'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        role="banner"
      >
        <nav
          className="container-lg flex items-center justify-between h-16 md:h-18"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none"
            aria-label="Lakbay PH — Home"
          >
            <span className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300
              ${scrolled || mobileOpen
                ? 'bg-[var(--color-primary)]'
                : 'bg-white/20 border border-white/40'}
            `}>
              <MapPin
                size={15}
                className={scrolled || mobileOpen ? 'text-white' : 'text-white'}
                strokeWidth={2.5}
              />
            </span>
            <span className={`
              font-display font-bold text-xl tracking-tight transition-colors duration-300
              ${scrolled || mobileOpen
                ? 'text-[var(--color-primary)] dark:text-[var(--color-primary-light)]'
                : 'text-white'}
            `}>
              Lakbay<span className={
                scrolled || mobileOpen
                  ? 'text-[var(--color-secondary)]'
                  : 'text-[var(--color-secondary-light)]'
              }> PH</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `
                    relative px-3 py-2 font-label text-xs font-semibold tracking-wider uppercase
                    transition-colors duration-200 rounded-md cursor-pointer
                    hover:text-[var(--color-secondary)] focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2
                    ${isActive ? activeStyle : linkColor}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[var(--color-secondary)] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}

            {/* Tools dropdown */}
            <li ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(prev => !prev)}
                aria-expanded={toolsOpen}
                aria-haspopup="menu"
                className={`
                  flex items-center gap-1 px-3 py-2 font-label text-xs font-semibold tracking-wider uppercase
                  transition-colors duration-200 rounded-md cursor-pointer
                  hover:text-[var(--color-secondary)] focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                  ${isToolsActive ? activeStyle : linkColor}
                `}
              >
                Tools
                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {toolsOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1E2A3A] rounded-xl shadow-xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden"
                  role="menu"
                >
                  {TOOLS_LINKS.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      role="menuitem"
                      className={({ isActive }) => `
                        block px-4 py-2.5 font-label text-xs tracking-wider uppercase
                        transition-colors duration-150 cursor-pointer
                        ${isActive
                          ? 'bg-[var(--color-sky-muted)] text-[var(--color-primary)] dark:bg-[var(--color-primary)]/20 dark:text-[var(--color-accent)]'
                          : 'text-[var(--color-ink)] dark:text-[#E8F4FD] hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 hover:text-[var(--color-secondary)]'
                        }
                      `}
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Right side: dark mode + hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none
                ${scrolled || mobileOpen
                  ? 'bg-[var(--color-sky-muted)] dark:bg-white/10 text-[var(--color-ink)] dark:text-[#E8F4FD]'
                  : 'bg-white/15 text-white hover:bg-white/25'}
              `}
            >
              {darkMode
                ? <Sun size={16} strokeWidth={2} />
                : <Moon size={16} strokeWidth={2} />
              }
            </button>

            <button
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className={`
                lg:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:outline-none
                ${scrolled || mobileOpen
                  ? 'bg-[var(--color-sky-muted)] dark:bg-white/10 text-[var(--color-ink)] dark:text-[#E8F4FD]'
                  : 'bg-white/15 text-white hover:bg-white/25'}
              `}
            >
              {mobileOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`
            lg:hidden overflow-hidden transition-all duration-300 ease-in-out
            bg-white/95 dark:bg-[#0F1923]/95 backdrop-blur-md
            ${mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
          `}
          aria-hidden={!mobileOpen}
        >
          <nav className="container-lg pb-6 pt-2" aria-label="Mobile navigation">
            <ul className="space-y-1" role="list">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-xl font-label text-xs tracking-wider uppercase
                      transition-colors duration-150 cursor-pointer
                      ${isActive
                        ? 'bg-[var(--color-sky-muted)] text-[var(--color-primary)] dark:bg-[var(--color-primary)]/20 dark:text-[var(--color-accent)]'
                        : 'text-[var(--color-ink)] dark:text-[#E8F4FD] hover:bg-[var(--color-sky-muted)] dark:hover:bg-white/5'}
                    `}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}

              <li>
                <div className="px-4 pt-3 pb-1">
                  <span className="font-label text-xs tracking-wider uppercase text-[var(--color-ink-subtle)] dark:text-white/40">
                    Tools
                  </span>
                </div>
                {TOOLS_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `
                      block px-6 py-2.5 rounded-xl font-label text-xs tracking-wider uppercase
                      transition-colors duration-150 cursor-pointer
                      ${isActive
                        ? 'text-[var(--color-primary)] dark:text-[var(--color-accent)]'
                        : 'text-[var(--color-ink-muted)] dark:text-[#A0BCD8] hover:text-[var(--color-primary)]'}
                    `}
                  >
                    — {label}
                  </NavLink>
                ))}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

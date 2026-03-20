import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Home, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Lakbay PH</title>
      </Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-sky-bg)] dark:bg-[#0F1923] text-center px-4 pt-20">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center mx-auto">
            <MapPin size={40} className="text-[var(--color-primary)]" aria-hidden="true" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center font-bold text-[var(--color-secondary)] text-sm" aria-hidden="true">?</div>
        </div>
        <h1 className="font-display font-bold text-6xl text-[var(--color-primary)] mb-4">404</h1>
        <h2 className="font-display font-semibold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Lost at Sea</h2>
        <p className="text-[var(--color-ink-muted)] dark:text-white/60 max-w-sm mb-8 leading-relaxed text-sm">
          This island doesn't seem to exist on our map. Let's get you back to familiar shores.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} aria-hidden="true" /> Go Home
          </Link>
          <Link to="/destinations" className="btn-outline">
            <Compass size={16} aria-hidden="true" /> Explore Destinations
          </Link>
        </div>
      </div>
    </>
  )
}

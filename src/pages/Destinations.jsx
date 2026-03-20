import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, MapPin, Star, X } from 'lucide-react'
import { destinations } from '../data/destinations'

const ISLAND_GROUPS = ['All', 'Luzon', 'Visayas', 'Mindanao']
const ACTIVITIES = ['All', 'Beach', 'Diving', 'Hiking', 'Heritage', 'City', 'Surfing', 'Nature', 'Wildlife']
const BUDGETS = ['All', 'Budget', 'Mid-range', 'Luxury']

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={11} strokeWidth={0}
          fill={i <= Math.round(rating) ? '#F59E0B' : '#CBD5E0'} aria-hidden="true" />
      ))}
      <span className="text-xs text-[var(--color-ink-muted)] ml-0.5">{rating}</span>
    </div>
  )
}

export default function Destinations() {
  const [search, setSearch] = useState('')
  const [islandGroup, setIslandGroup] = useState('All')
  const [activity, setActivity] = useState('All')
  const [budget, setBudget] = useState('All')

  const filtered = useMemo(() => {
    return destinations.filter(d => {
      const matchSearch = !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.province.toLowerCase().includes(search.toLowerCase()) ||
        d.region.toLowerCase().includes(search.toLowerCase())
      const matchGroup = islandGroup === 'All' || d.island_group === islandGroup
      const matchActivity = activity === 'All' || d.activities.includes(activity)
      const matchBudget = budget === 'All' || d.budget_level === budget
      return matchSearch && matchGroup && matchActivity && matchBudget
    })
  }, [search, islandGroup, activity, budget])

  const hasFilters = islandGroup !== 'All' || activity !== 'All' || budget !== 'All' || search

  const clearFilters = () => {
    setSearch('')
    setIslandGroup('All')
    setActivity('All')
    setBudget('All')
  }

  return (
    <>
      <Helmet>
        <title>Destinations — Lakbay PH</title>
        <meta name="description" content="Explore 20+ Philippine travel destinations — beaches, mountains, heritage cities, dive sites, and more." />
      </Helmet>

      {/* Page header */}
      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=60" alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[var(--color-ink)]" />
        </div>
        <div className="relative container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Explore the Archipelago</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            All Destinations
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed mb-8">
            {destinations.length} handpicked destinations across Luzon, Visayas, and Mindanao.
          </p>
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search destinations, provinces, regions…"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40
                backdrop-blur-sm focus:outline-none focus:border-[var(--color-primary)] transition-all"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem' }}
              aria-label="Search destinations"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-8">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-center mb-8" role="group" aria-label="Destination filters">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Group:</span>
              {ISLAND_GROUPS.map(g => (
                <button key={g} onClick={() => setIslandGroup(g)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer border
                    ${islandGroup === g
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                  aria-pressed={islandGroup === g}>
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Activity:</span>
              {ACTIVITIES.map(a => (
                <button key={a} onClick={() => setActivity(a)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer border
                    ${activity === a
                      ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]'
                      : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]'}`}
                  aria-pressed={activity === a}>
                  {a}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Budget:</span>
              {BUDGETS.map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer border
                    ${budget === b
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-accent)] hover:text-[var(--color-accent-dark)]'}`}
                  aria-pressed={budget === b}>
                  {b}
                </button>
              ))}
            </div>

            {hasFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full font-label text-xs text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer">
                <X size={12} aria-hidden="true" /> Clear
              </button>
            )}
          </div>

          <p className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-6">
            Showing {filtered.length} of {destinations.length} destinations
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map(dest => (
                <Link key={dest.id} to={`/destinations/${dest.slug}`}
                  className="group card block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  data-aos="fade-up" aria-label={`Explore ${dest.name}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={dest.image_url} alt={`${dest.name}, ${dest.province}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className={`absolute top-3 right-3 tag text-white backdrop-blur-sm border border-white/30
                      ${dest.budget_level === 'Budget' ? 'bg-green-500/70' :
                        dest.budget_level === 'Mid-range' ? 'bg-[var(--color-secondary)]/70' :
                        'bg-purple-500/70'}`}>
                      {dest.budget_level}
                    </span>
                  </div>
                  <div className="p-4">
                    <h2 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {dest.name}
                    </h2>
                    <p className="flex items-center gap-1 text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-3">
                      <MapPin size={11} aria-hidden="true" />
                      {dest.province} · {dest.island_group}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {dest.activities.slice(0, 3).map(act => (
                        <span key={act} className="tag tag-teal">{act}</span>
                      ))}
                    </div>
                    <StarRating rating={dest.rating} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--color-sky-muted)] dark:bg-white/5 flex items-center justify-center mb-4">
                <Search size={28} className="text-[var(--color-ink-subtle)]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl text-[var(--color-ink)] dark:text-white mb-2">No destinations found</h3>
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50 mb-6">Try adjusting your search or clearing the filters.</p>
              <button onClick={clearFilters} className="btn-outline">Clear All Filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

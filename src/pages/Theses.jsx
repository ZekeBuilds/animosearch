import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search, X, BookOpen } from 'lucide-react'
import { theses } from '../data/theses'
import { colleges } from '../data/colleges'

const COLLEGES = ['All', ...colleges.map(c => c.abbreviation)]
const DEGREE_LEVELS = ['All', 'Undergraduate', 'Graduate', 'Doctoral']
const YEARS = ['All', '2020-2024', '2015-2019', '2010-2014', '2000-2009', 'Before 2000']

function degreeBadge(level) {
  if (level === 'undergraduate') return { label: 'Undergrad', cls: 'tag-blue' }
  if (level === 'graduate') return { label: 'Masteral', cls: 'tag-orange' }
  return { label: 'Doctoral', cls: 'tag-teal' }
}

function ThesisCard({ thesis }) {
  const badge = degreeBadge(thesis.degreeLevel)
  const college = colleges.find(c => c.id === thesis.college.toLowerCase())

  return (
    <Link
      to={`/theses/${thesis.slug}`}
      className="group card block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      data-aos="fade-up"
      aria-label={`Read: ${thesis.title}`}
    >
      <div
        className="h-1.5 w-full"
        style={{ background: college?.color || 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="tag tag-blue">{thesis.college}</span>
          <span className={`tag ${badge.cls}`}>{badge.label}</span>
          <span className="ml-auto font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40">{thesis.year}</span>
        </div>
        <h2 className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-3">
          {thesis.title}
        </h2>
        <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-3">
          {thesis.author} · {thesis.department}
        </p>
        <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed line-clamp-3">
          {thesis.abstract}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {thesis.keywords.slice(0, 3).map(kw => (
            <span key={kw} className="tag tag-teal">{kw}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function Theses() {
  const [search, setSearch] = useState('')
  const [college, setCollege] = useState('All')
  const [degreeLevel, setDegreeLevel] = useState('All')
  const [yearRange, setYearRange] = useState('All')

  const filtered = useMemo(() => {
    return theses.filter(t => {
      const matchSearch = !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.author.toLowerCase().includes(search.toLowerCase()) ||
        t.abstract.toLowerCase().includes(search.toLowerCase()) ||
        t.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
      const matchCollege = college === 'All' || t.college === college
      const matchDegree = degreeLevel === 'All' || t.degreeLevel === degreeLevel.toLowerCase()
      const matchYear = (() => {
        if (yearRange === 'All') return true
        if (yearRange === '2020-2024') return t.year >= 2020
        if (yearRange === '2015-2019') return t.year >= 2015 && t.year <= 2019
        if (yearRange === '2010-2014') return t.year >= 2010 && t.year <= 2014
        if (yearRange === '2000-2009') return t.year >= 2000 && t.year <= 2009
        if (yearRange === 'Before 2000') return t.year < 2000
        return true
      })()
      return matchSearch && matchCollege && matchDegree && matchYear
    })
  }, [search, college, degreeLevel, yearRange])

  const hasFilters = college !== 'All' || degreeLevel !== 'All' || yearRange !== 'All' || search

  const clearFilters = () => {
    setSearch('')
    setCollege('All')
    setDegreeLevel('All')
    setYearRange('All')
  }

  return (
    <>
      <Helmet>
        <title>Browse Theses — AnimoSearch</title>
        <meta name="description" content="Search and browse 100+ DLSU theses by college, degree level, year, and keyword." />
      </Helmet>

      {/* Page header */}
      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=60" alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-[var(--color-ink)]" />
        </div>
        <div className="relative container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Animo Repository</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Browse Theses
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed mb-8">
            {theses.length} thesis and dissertation records from DLSU's Animo Repository.
          </p>
          <div className="relative max-w-lg">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, author, keyword, abstract…"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 backdrop-blur-sm focus:outline-none focus:border-[var(--color-secondary)] transition-all"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem' }}
              aria-label="Search theses"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-8">

          {/* Filter bar */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 items-center mb-8" role="group" aria-label="Thesis filters">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">College:</span>
              {COLLEGES.map(c => (
                <button key={c} onClick={() => setCollege(c)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer border
                    ${college === c
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
                  aria-pressed={college === c}>
                  {c}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Level:</span>
              {DEGREE_LEVELS.map(d => (
                <button key={d} onClick={() => setDegreeLevel(d)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer border
                    ${degreeLevel === d
                      ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]'
                      : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary-dark)]'}`}
                  aria-pressed={degreeLevel === d}>
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Year:</span>
              {YEARS.map(y => (
                <button key={y} onClick={() => setYearRange(y)}
                  className={`px-3 py-1.5 rounded-full font-label text-xs transition-all cursor-pointer border
                    ${yearRange === y
                      ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                      : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-accent)] hover:text-[var(--color-accent-dark)]'}`}
                  aria-pressed={yearRange === y}>
                  {y}
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
            Showing {filtered.length} of {theses.length} theses
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(thesis => (
                <ThesisCard key={thesis.id} thesis={thesis} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--color-sky-muted)] dark:bg-white/5 flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-[var(--color-ink-subtle)]" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl text-[var(--color-ink)] dark:text-white mb-2">No theses found</h3>
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50 mb-6">Try adjusting your search or clearing the filters.</p>
              <button onClick={clearFilters} className="btn-outline">Clear All Filters</button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

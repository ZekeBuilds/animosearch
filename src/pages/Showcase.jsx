import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { X, ExternalLink, BookOpen, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllTheses } from '../lib/thesesApi'
import { colleges } from '../data/colleges'

const COLLEGE_FILTERS = ['All', ...colleges.map(c => c.abbreviation)]

export default function Showcase() {
  const [activeCollege, setActiveCollege] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const { data: theses = [] } = useQuery({ queryKey: ['theses'], queryFn: fetchAllTheses })

  const featured = theses.filter(t => t.featured)
  const filtered = activeCollege === 'All'
    ? featured
    : featured.filter(t => t.college === activeCollege)

  const openThesis = lightbox ? theses.find(t => t.id === lightbox) : null
  const openCollege = openThesis ? colleges.find(c => c.id === openThesis.college.toLowerCase()) : null

  return (
    <>
      <Helmet>
        <title>Research Showcase — AnimoSearch</title>
        <meta name="description" content="Explore DLSU's most notable thesis research across CCS, COE, COB, CLA, and COS. Featured works from the Animo Repository." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Notable Research</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Research Showcase
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            A curated selection of standout theses and dissertations from across DLSU's colleges.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by college">
            {COLLEGE_FILTERS.map(c => (
              <button
                key={c}
                onClick={() => setActiveCollege(c)}
                className={`px-4 py-2 rounded-full font-label text-xs transition-all cursor-pointer border ${
                  activeCollege === c
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
                aria-pressed={activeCollege === c}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-6">
            {filtered.length} featured {filtered.length === 1 ? 'thesis' : 'theses'}
          </p>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen size={40} className="text-[var(--color-ink-subtle)] mb-3 opacity-30" aria-hidden="true" />
              <p className="font-display text-lg text-[var(--color-ink)] dark:text-white">No featured theses for this college yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border-light)] dark:divide-white/10">
              {filtered.map((thesis, i) => {
                const college = colleges.find(c => c.id === thesis.college.toLowerCase())
                return (
                  <article
                    key={thesis.id}
                    className="group flex items-start gap-4 py-5 px-3 -mx-3 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-[var(--color-card-dark)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                    onClick={() => setLightbox(thesis.id)}
                    data-aos="fade-up"
                    data-aos-delay={Math.min(i * 40, 200)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Read abstract: ${thesis.title}`}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setLightbox(thesis.id)}
                  >
                    <div
                      className="w-1 self-stretch rounded-full flex-shrink-0 min-h-[2.5rem]"
                      style={{ background: college?.color || 'var(--color-primary)' }}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="tag tag-blue">{thesis.college}</span>
                        <span className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 ml-auto">{thesis.year}</span>
                      </div>
                      <h2 className="font-display font-bold text-[0.95rem] text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-1 leading-snug">
                        {thesis.title}
                      </h2>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-2">
                        {thesis.author} · {thesis.department}
                      </p>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed line-clamp-2">
                        {thesis.abstract}
                      </p>
                    </div>
                    <span className="font-label text-xs text-[var(--color-primary)] flex-shrink-0 mt-0.5 group-hover:underline whitespace-nowrap">
                      Read →
                    </span>
                  </article>
                )
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50 mb-4">Looking for something specific?</p>
            <Link to="/theses" className="btn-primary">
              Browse All Theses <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {openThesis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={openThesis.title}
        >
          <div
            className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-1.5 w-full rounded-t-2xl" style={{ background: openCollege?.color || 'var(--color-primary)' }} aria-hidden="true" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="tag tag-blue">{openThesis.college}</span>
                  <span className="tag tag-teal">{openThesis.year}</span>
                </div>
                <button
                  onClick={() => setLightbox(null)}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/50 transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <h2 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-2 leading-snug">
                {openThesis.title}
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-5">
                {openThesis.author} · {openThesis.department}
              </p>
              <h3 className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-2">Abstract</h3>
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed mb-6">
                {openThesis.abstract}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/theses/${openThesis.slug}`}
                  className="btn-primary text-xs"
                  onClick={() => setLightbox(null)}
                >
                  Full Details <ArrowRight size={12} aria-hidden="true" />
                </Link>
                {openThesis.animoUrl && (
                  <a
                    href={openThesis.animoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-xs cursor-pointer"
                  >
                    <ExternalLink size={12} aria-hidden="true" /> Animo Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ExternalLink, Share2, ArrowLeft, Tag, GraduationCap, Building2, Calendar, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchThesisBySlug, fetchRelatedTheses } from '../lib/thesesApi'
import { colleges } from '../data/colleges'

export default function ThesisDetail() {
  const { slug } = useParams()
  const [copied, setCopied] = useState(false)

  const { data: thesis, isLoading, isError } = useQuery({
    queryKey: ['thesis', slug],
    queryFn: () => fetchThesisBySlug(slug),
  })

  const { data: related = [] } = useQuery({
    queryKey: ['related-theses', thesis?.college, slug],
    queryFn: () => fetchRelatedTheses(thesis.college, slug, 4),
    enabled: !!thesis,
  })

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: thesis?.title, text: `DLSU Thesis: ${thesis?.title}`, url: window.location.href }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-3 text-[var(--color-ink-muted)] dark:text-white/50">
        <Loader2 size={28} className="animate-spin" aria-hidden="true" />
        <span className="font-label text-sm">Loading thesis…</span>
      </div>
    )
  }

  if (isError || thesis === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
        <h1 className="font-display text-3xl text-[var(--color-ink)] dark:text-white">Thesis not found</h1>
        <Link to="/theses" className="btn-primary">Back to Browse Theses</Link>
      </div>
    )
  }

  const college = colleges.find(c => c.id === thesis.college.toLowerCase())
  const collegeColor = college?.color || 'var(--color-primary)'

  const degreeLabel = thesis.degreeLevel === 'undergraduate' ? 'Undergraduate / Capstone'
    : thesis.degreeLevel === 'graduate' ? 'Master\'s Thesis'
    : 'Doctoral Dissertation'

  return (
    <>
      <Helmet>
        <title>{thesis.title} — AnimoSearch</title>
        <meta name="description" content={thesis.abstract.slice(0, 155) + '…'} />
      </Helmet>

      {/* Hero */}
      <section
        className="relative pt-28 pb-12 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${collegeColor} 0%, #1A1A2E 100%)` }}
      >
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        </div>
        <div className="relative container-lg">
          <Link to="/theses" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-label text-xs tracking-wider uppercase mb-6 transition-colors cursor-pointer">
            <ArrowLeft size={14} aria-hidden="true" /> All Theses
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="tag bg-white/20 backdrop-blur-sm text-white border border-white/30">{thesis.college}</span>
            <span className="tag bg-white/15 backdrop-blur-sm text-white border border-white/25">{degreeLabel}</span>
            <span className="tag bg-white/15 backdrop-blur-sm text-white border border-white/25">{thesis.year}</span>
          </div>
          <h1 className="font-display font-bold text-white mb-4 max-w-3xl" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.75rem)', lineHeight: 1.2 }}>
            {thesis.title}
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-white/70 text-sm">
              <GraduationCap size={14} aria-hidden="true" /> {thesis.author}
            </span>
            <span className="flex items-center gap-1.5 text-white/70 text-sm">
              <Building2 size={14} aria-hidden="true" /> {thesis.department}
            </span>
            <span className="flex items-center gap-1.5 text-white/70 text-sm">
              <Calendar size={14} aria-hidden="true" /> {thesis.year}
            </span>
          </div>
        </div>
      </section>

      {/* Action bar */}
      <div className="bg-white dark:bg-[#1A2E20] border-b border-[var(--color-border-light)] dark:border-white/10">
        <div className="container-lg py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {thesis.animoUrl && (
              <a
                href={thesis.animoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-white font-label text-xs hover:bg-[var(--color-primary-dark)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <ExternalLink size={13} aria-hidden="true" /> View on Animo Repository
              </a>
            )}
          </div>
          <button onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border-light)] dark:border-white/20 font-label text-xs text-[var(--color-primary)] hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            <Share2 size={13} aria-hidden="true" /> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14]">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Abstract */}
              <section>
                <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Abstract</h2>
                <p className="text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed text-[0.9375rem]">
                  {thesis.abstract}
                </p>
              </section>

              {/* Keywords */}
              {thesis.keywords?.length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {thesis.keywords.map(kw => (
                      <Link
                        key={kw}
                        to={`/theses?q=${encodeURIComponent(kw)}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[var(--color-card-dark)] border border-[var(--color-border-light)] dark:border-white/10 text-sm text-[var(--color-ink)] dark:text-white hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        <Tag size={11} aria-hidden="true" />
                        {kw}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Animo Repository link */}
              {thesis.animoUrl && (
                <section>
                  <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Full Text</h2>
                  <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-5 border border-[var(--color-border-light)] dark:border-white/10 flex gap-4 items-start">
                    <ExternalLink size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed mb-3">
                        The full text of this thesis is available on the Animo Repository, DLSU's institutional digital library.
                      </p>
                      <a
                        href={thesis.animoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-label text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] cursor-pointer transition-colors"
                      >
                        Access on Animo Repository <ExternalLink size={12} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 sticky top-24">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-5">Thesis Info</h3>
                <dl className="space-y-4">
                  {[
                    ['Author', thesis.author],
                    ['College', thesis.collegeName],
                    ['Department', thesis.department],
                    ['Degree Level', degreeLabel],
                    ['Year', String(thesis.year)],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 mb-0.5">{label}</dt>
                      <dd className="text-sm font-medium text-[var(--color-ink)] dark:text-white">{value}</dd>
                    </div>
                  ))}
                </dl>

                {college && (
                  <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] dark:border-white/10">
                    <Link
                      to="/colleges"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: college.color + '20' }}
                        aria-hidden="true"
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: college.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors">{college.abbreviation}</p>
                        <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 leading-tight">{college.name}</p>
                      </div>
                    </Link>
                  </div>
                )}

                <div className="mt-4">
                  <Link to="/checklist" className="btn-primary w-full justify-center">
                    <Check size={14} aria-hidden="true" /> Submission Checklist
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* Related theses */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-8">More from {thesis.college}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(t => (
                  <Link
                    key={t.id}
                    to={`/theses/${t.slug}`}
                    className="group bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-4 border border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  >
                    <p className="font-display font-semibold text-sm text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-3 mb-2">{t.title}</p>
                    <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50">{t.author} · {t.year}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}

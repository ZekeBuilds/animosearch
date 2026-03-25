import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search, Lightbulb, ChevronDown, Loader2, AlertCircle, BookOpen } from 'lucide-react'
import { colleges } from '../data/colleges'
import { supabase } from '../lib/supabaseClient'

export default function GapFinder() {
  const [selectedCollege, setSelectedCollege] = useState('')
  const [selectedDept, setSelectedDept] = useState('')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const currentCollege = colleges.find(c => c.abbreviation === selectedCollege)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCollege) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('gap-finder', {
        body: {
          college: selectedCollege,
          department: selectedDept || undefined,
          topic: topic.trim() || undefined,
        },
      })

      if (fnError) throw new Error(fnError.message)
      if (data?.error) throw new Error(data.error)

      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Parse the numbered list from Groq's response
  const parseGaps = (analysis) => {
    if (!analysis) return []
    return analysis
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => /^\d+[\.\)]/.test(line))
      .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
  }

  const gaps = result ? parseGaps(result.analysis) : []

  return (
    <>
      <Helmet>
        <title>Research Gap Finder — AnimoSearch</title>
        <meta name="description" content="AI-powered research gap analysis for DLSU students. Pick your college and department to discover underresearched topics for your thesis." />
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">AI Research Tool</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Research Gap Finder
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Select your college and department. The AI analyzes existing DLSU theses and identifies 5 topics that haven't been studied yet — giving you a head start on your research proposal.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-6 sticky top-24 space-y-5">
                <h2 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white">Find Research Gaps</h2>

                {/* College */}
                <div>
                  <label htmlFor="gap-college" className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 block mb-2 uppercase tracking-wider">
                    College <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="gap-college"
                      value={selectedCollege}
                      onChange={e => { setSelectedCollege(e.target.value); setSelectedDept('') }}
                      required
                      className="w-full appearance-none bg-[var(--color-sky-bg)] dark:bg-[#1A2E20] border border-[var(--color-border-light)] dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-[var(--color-ink)] dark:text-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                    >
                      <option value="">Select a college…</option>
                      {colleges.map(c => (
                        <option key={c.abbreviation} value={c.abbreviation}>{c.abbreviation} — {c.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] dark:text-white/40 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>

                {/* Department */}
                {currentCollege && (
                  <div>
                    <label htmlFor="gap-dept" className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 block mb-2 uppercase tracking-wider">
                      Department <span className="text-[var(--color-ink-muted)] dark:text-white/30 normal-case font-sans">(optional)</span>
                    </label>
                    <div className="relative">
                      <select
                        id="gap-dept"
                        value={selectedDept}
                        onChange={e => setSelectedDept(e.target.value)}
                        className="w-full appearance-none bg-[var(--color-sky-bg)] dark:bg-[#1A2E20] border border-[var(--color-border-light)] dark:border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-[var(--color-ink)] dark:text-white font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
                      >
                        <option value="">All Departments</option>
                        {currentCollege.departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)] dark:text-white/40 pointer-events-none" aria-hidden="true" />
                    </div>
                  </div>
                )}

                {/* Topic area */}
                <div>
                  <label htmlFor="gap-topic" className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 block mb-2 uppercase tracking-wider">
                    Topic Area <span className="text-[var(--color-ink-muted)] dark:text-white/30 normal-case font-sans">(optional)</span>
                  </label>
                  <input
                    id="gap-topic"
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. machine learning, environmental policy…"
                    maxLength={150}
                    className="w-full bg-[var(--color-sky-bg)] dark:bg-[#1A2E20] border border-[var(--color-border-light)] dark:border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-ink)] dark:text-white placeholder:text-[var(--color-ink-subtle)] dark:placeholder:text-white/25 font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                  <p className="text-xs text-[var(--color-ink-subtle)] dark:text-white/30 mt-1.5">Narrows the gap analysis to your area of interest.</p>
                </div>

                {/* College color accent */}
                {currentCollege && (
                  <div
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: currentCollege.color + '18', border: `1px solid ${currentCollege.color}30` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: currentCollege.color }} aria-hidden="true" />
                    <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-snug">{currentCollege.description}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedCollege || loading}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={14} className="animate-spin" aria-hidden="true" /> Analyzing…</>
                  ) : (
                    <><Search size={14} aria-hidden="true" /> Find Research Gaps</>
                  )}
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Idle state */}
              {!result && !error && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-5" aria-hidden="true">
                    <Lightbulb size={28} className="text-[var(--color-primary)]" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--color-ink)] dark:text-white mb-2">Discover What Hasn't Been Studied</h3>
                  <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50 max-w-sm leading-relaxed">
                    Select your college and click "Find Research Gaps" to get 5 AI-identified topics that are underrepresented in DLSU's thesis archive.
                  </p>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="w-12 h-12 border-2 border-[var(--color-border-light)] border-t-[var(--color-primary)] rounded-full animate-spin" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[var(--color-ink)] dark:text-white text-sm mb-1">Analyzing thesis records…</p>
                    <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/40">The AI is reviewing existing research in {selectedCollege}{selectedDept ? ` / ${selectedDept}` : ''}.</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-2xl p-6 flex gap-4">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Analysis failed</p>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {result && gaps.length > 0 && (
                <div
                  className="space-y-4"
                  style={{ animation: 'fadeInUp 0.4s ease-out both' }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="font-label text-xs tracking-wider text-[var(--color-ink-subtle)] dark:text-white/40 uppercase mb-1">Research Gaps Identified</p>
                      <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white">
                        {result.college}{result.department && result.department !== 'All Departments' ? ` / ${result.department}` : ''}
                      </h2>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/40 mt-1">
                        Based on {result.thesisCount} thesis record{result.thesisCount !== 1 ? 's' : ''}
                        {result.topic ? ` · Topic area: "${result.topic}"` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full px-3 py-1.5 flex-shrink-0">
                      <BookOpen size={12} aria-hidden="true" />
                      <span className="font-label text-xs font-semibold">{gaps.length} gaps</span>
                    </div>
                  </div>

                  {/* Gap cards */}
                  {gaps.map((gap, i) => {
                    const [title, ...rest] = gap.split(' — ')
                    const explanation = rest.join(' — ')
                    return (
                      <div
                        key={i}
                        className="bg-white dark:bg-[var(--color-card-dark)] rounded-xl border border-[var(--color-border-light)] dark:border-white/10 p-5 flex gap-4"
                        style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.4s ease-out both' }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-stat font-bold text-sm"
                          style={{
                            background: (currentCollege?.color || '#005E3A') + '20',
                            color: currentCollege?.color || '#005E3A',
                          }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--color-ink)] dark:text-white text-sm leading-snug mb-1.5">
                            {title || gap}
                          </p>
                          {explanation && (
                            <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed">{explanation}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Disclaimer */}
                  <p className="text-xs text-[var(--color-ink-subtle)] dark:text-white/30 leading-relaxed pt-2">
                    These suggestions are AI-generated based on the AnimoSearch database. Always validate against your department's latest research before committing to a topic.
                  </p>
                </div>
              )}

              {/* Fallback: result but no gaps parsed */}
              {result && gaps.length === 0 && result.analysis && (
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-6">
                  <p className="font-label text-xs tracking-wider text-[var(--color-ink-subtle)] dark:text-white/40 uppercase mb-3">Analysis Result</p>
                  <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed whitespace-pre-line">{result.analysis}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

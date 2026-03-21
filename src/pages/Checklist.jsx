import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { CheckSquare, Square, RotateCcw, FileText, ClipboardCheck, Presentation, GraduationCap, BookMarked, Upload } from 'lucide-react'
import { checklistCategories } from '../data/checklistItems'

const ICON_MAP = { FileText, ClipboardCheck, Presentation, GraduationCap, BookMarked, Upload }
const DEGREE_LEVELS = ['all', 'undergraduate', 'graduate', 'doctoral']
const DEGREE_LABELS = { all: 'All Levels', undergraduate: 'Undergraduate', graduate: 'Graduate', doctoral: 'Doctoral' }

const STORAGE_KEY = 'animosearch-checklist'

export default function Checklist() {
  const [degreeLevel, setDegreeLevel] = useState('all')
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)) } catch {}
  }, [checked])

  const visibleCategories = checklistCategories.filter(
    cat => cat.degreeLevel === 'all' || cat.degreeLevel === degreeLevel || degreeLevel === 'all'
  )

  const allItems = visibleCategories.flatMap(cat => cat.items)
  const checkedCount = allItems.filter(item => checked[item.id]).length
  const progress = allItems.length ? Math.round((checkedCount / allItems.length) * 100) : 0

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const reset = () => {
    const newState = {}
    allItems.forEach(item => { newState[item.id] = false })
    setChecked(prev => ({ ...prev, ...newState }))
  }

  return (
    <>
      <Helmet>
        <title>Submission Checklist — AnimoSearch</title>
        <meta name="description" content="Complete thesis submission requirements checklist for DLSU students. Core documentation, approvals, defense prep, and Animo Repository upload." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Thesis Tools</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Requirements Checklist
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Track every document and approval required for thesis submission. Your progress is saved automatically.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">

          {/* Progress bar */}
          <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 mb-8" data-aos="fade-up">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white">{progress}%</p>
                <p className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50">
                  {checkedCount} of {allItems.length} items completed
                </p>
              </div>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 border border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer"
              >
                <RotateCcw size={12} aria-hidden="true" /> Reset
              </button>
            </div>
            <div className="h-3 bg-[var(--color-sky-muted)] dark:bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: progress === 100 ? '#22c55e' : 'var(--color-primary)' }}
              />
            </div>
          </div>

          {/* Degree level filter */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by degree level">
            {DEGREE_LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setDegreeLevel(level)}
                className={`px-4 py-2 rounded-full font-label text-xs transition-all cursor-pointer border ${
                  degreeLevel === level
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white dark:bg-white/10 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
                aria-pressed={degreeLevel === level}
              >
                {DEGREE_LABELS[level]}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="space-y-6">
            {visibleCategories.map(cat => {
              const CatIcon = ICON_MAP[cat.icon] || FileText
              const catChecked = cat.items.filter(item => checked[item.id]).length
              return (
                <div key={cat.id} className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden" data-aos="fade-up">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border-light)] dark:border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                      <CatIcon size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
                    </div>
                    <h2 className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white flex-1">{cat.label}</h2>
                    <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">{catChecked}/{cat.items.length}</span>
                  </div>
                  <ul className="divide-y divide-[var(--color-border-light)] dark:divide-white/5">
                    {cat.items.map(item => (
                      <li key={item.id}>
                        <button
                          onClick={() => toggle(item.id)}
                          className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                          aria-checked={!!checked[item.id]}
                          role="checkbox"
                        >
                          {checked[item.id]
                            ? <CheckSquare size={18} className="text-[var(--color-primary)] flex-shrink-0" aria-hidden="true" />
                            : <Square size={18} className="text-[var(--color-ink-subtle)] dark:text-white/30 flex-shrink-0" aria-hidden="true" />
                          }
                          <span className={`text-sm flex-1 ${checked[item.id] ? 'line-through text-[var(--color-ink-subtle)] dark:text-white/30' : 'text-[var(--color-ink)] dark:text-white'}`}>
                            {item.label}
                          </span>
                          {item.essential && (
                            <span className="font-label text-[10px] text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary)] bg-[var(--color-secondary)]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                              Essential
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {progress === 100 && (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-500/20 text-center" data-aos="fade-up">
              <p className="font-display font-bold text-lg text-green-700 dark:text-green-300 mb-1">All items checked!</p>
              <p className="text-sm text-green-600 dark:text-green-400">You are ready to submit your thesis. Good luck on your defense.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

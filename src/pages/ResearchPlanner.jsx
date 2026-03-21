import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, Check, Clock, Circle, CalendarDays, ChevronDown } from 'lucide-react'

const STORAGE_KEY = 'animosearch-planner'

const MILESTONE_TEMPLATES = [
  { id: 'tpl-1', title: 'Topic selection and adviser meeting', phase: 'Proposal', status: 'pending', targetDate: '' },
  { id: 'tpl-2', title: 'Complete Chapter 1: Introduction', phase: 'Proposal', status: 'pending', targetDate: '' },
  { id: 'tpl-3', title: 'Complete Chapter 2: Review of Related Literature', phase: 'Proposal', status: 'pending', targetDate: '' },
  { id: 'tpl-4', title: 'Complete Chapter 3: Methodology', phase: 'Proposal', status: 'pending', targetDate: '' },
  { id: 'tpl-5', title: 'Proposal defense', phase: 'Proposal', status: 'pending', targetDate: '' },
  { id: 'tpl-6', title: 'Data collection and experiments', phase: 'Writing', status: 'pending', targetDate: '' },
  { id: 'tpl-7', title: 'Complete Chapter 4: Results and Discussion', phase: 'Writing', status: 'pending', targetDate: '' },
  { id: 'tpl-8', title: 'Complete Chapter 5: Conclusion and Recommendations', phase: 'Writing', status: 'pending', targetDate: '' },
  { id: 'tpl-9', title: 'Turnitin check (below 20%)', phase: 'Submission', status: 'pending', targetDate: '' },
  { id: 'tpl-10', title: 'Submit manuscript for panel review', phase: 'Submission', status: 'pending', targetDate: '' },
  { id: 'tpl-11', title: 'Final defense', phase: 'Defense', status: 'pending', targetDate: '' },
  { id: 'tpl-12', title: 'Incorporate panel revisions', phase: 'Defense', status: 'pending', targetDate: '' },
  { id: 'tpl-13', title: 'Upload to Animo Repository', phase: 'Defense', status: 'pending', targetDate: '' },
]

const PHASES = ['Proposal', 'Writing', 'Submission', 'Defense']
const PHASE_COLORS = {
  Proposal: 'var(--color-primary)',
  Writing: 'var(--color-secondary)',
  Submission: 'var(--color-accent)',
  Defense: '#22c55e',
}
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Circle },
  { value: 'in-progress', label: 'In Progress', icon: Clock },
  { value: 'done', label: 'Done', icon: Check },
]

function StatusBadge({ status }) {
  const opt = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0]
  const Icon = opt.icon
  const colors = {
    pending: 'text-[var(--color-ink-muted)] dark:text-white/40',
    'in-progress': 'text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary)]',
    done: 'text-green-600 dark:text-green-400',
  }
  return (
    <span className={`flex items-center gap-1 font-label text-xs ${colors[status]}`}>
      <Icon size={12} aria-hidden="true" /> {opt.label}
    </span>
  )
}

export default function ResearchPlanner() {
  const [milestones, setMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : MILESTONE_TEMPLATES.map(t => ({ ...t }))
    } catch { return MILESTONE_TEMPLATES.map(t => ({ ...t })) }
  })
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPhase, setNewPhase] = useState('Proposal')
  const [newDate, setNewDate] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones)) } catch {}
  }, [milestones])

  const updateStatus = (id, status) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m))
  }

  const updateDate = (id, date) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, targetDate: date } : m))
  }

  const deleteMilestone = (id) => {
    setMilestones(prev => prev.filter(m => m.id !== id))
  }

  const addMilestone = () => {
    if (!newTitle.trim()) return
    const newItem = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      phase: newPhase,
      status: 'pending',
      targetDate: newDate,
    }
    setMilestones(prev => [...prev, newItem])
    setNewTitle('')
    setNewDate('')
    setAdding(false)
  }

  const doneCount = milestones.filter(m => m.status === 'done').length
  const progress = milestones.length ? Math.round((doneCount / milestones.length) * 100) : 0

  return (
    <>
      <Helmet>
        <title>Research Planner — AnimoSearch</title>
        <meta name="description" content="Plan your DLSU thesis journey with a milestone-based research planner. Track progress from proposal to final submission." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Thesis Tools</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Research Planner
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Track every milestone from topic selection to Animo Repository upload. Your plan is saved in your browser.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">

          {/* Progress summary */}
          <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 mb-8" data-aos="fade-up">
            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div>
                <p className="font-display font-bold text-3xl text-[var(--color-ink)] dark:text-white">{progress}%</p>
                <p className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50">{doneCount} of {milestones.length} milestones completed</p>
              </div>
              <div className="flex gap-4 flex-wrap">
                {PHASES.map(phase => {
                  const phaseItems = milestones.filter(m => m.phase === phase)
                  const phaseDone = phaseItems.filter(m => m.status === 'done').length
                  return (
                    <div key={phase} className="text-center">
                      <p className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">{phase}</p>
                      <p className="font-semibold text-sm" style={{ color: PHASE_COLORS[phase] }}>{phaseDone}/{phaseItems.length}</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="h-2.5 bg-[var(--color-sky-muted)] dark:bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: progress === 100 ? '#22c55e' : 'var(--color-primary)' }}
              />
            </div>
          </div>

          {/* Milestones by phase */}
          <div className="space-y-8">
            {PHASES.map(phase => {
              const items = milestones.filter(m => m.phase === phase)
              if (items.length === 0) return null
              return (
                <section key={phase} data-aos="fade-up">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-0.5 w-8 rounded-full" style={{ background: PHASE_COLORS[phase] }} aria-hidden="true" />
                    <h2 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white">{phase} Phase</h2>
                  </div>
                  <div className="space-y-3">
                    {items.map(m => (
                      <div
                        key={m.id}
                        className={`bg-white dark:bg-[var(--color-card-dark)] rounded-xl border transition-all ${
                          m.status === 'done'
                            ? 'border-green-200 dark:border-green-500/20'
                            : 'border-[var(--color-border-light)] dark:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: PHASE_COLORS[phase] }} aria-hidden="true" />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${m.status === 'done' ? 'line-through text-[var(--color-ink-subtle)] dark:text-white/30' : 'text-[var(--color-ink)] dark:text-white'}`}>
                              {m.title}
                            </p>
                            {m.targetDate && (
                              <p className="flex items-center gap-1 text-xs text-[var(--color-ink-muted)] dark:text-white/40 mt-0.5">
                                <CalendarDays size={11} aria-hidden="true" /> {m.targetDate}
                              </p>
                            )}
                          </div>

                          {/* Status selector */}
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <select
                                value={m.status}
                                onChange={e => updateStatus(m.id, e.target.value)}
                                className="appearance-none pl-2 pr-6 py-1.5 rounded-lg font-label text-xs bg-[var(--color-sky-bg)] dark:bg-white/10 text-[var(--color-ink)] dark:text-white border border-[var(--color-border-light)] dark:border-white/10 cursor-pointer focus:outline-none focus:border-[var(--color-primary)]"
                                aria-label="Status"
                              >
                                {STATUS_OPTIONS.map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                              <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-ink-muted)]" aria-hidden="true" />
                            </div>
                          </div>

                          {/* Date input */}
                          <input
                            type="date"
                            value={m.targetDate}
                            onChange={e => updateDate(m.id, e.target.value)}
                            className="hidden sm:block text-xs px-2 py-1.5 rounded-lg bg-[var(--color-sky-bg)] dark:bg-white/10 border border-[var(--color-border-light)] dark:border-white/10 text-[var(--color-ink)] dark:text-white focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                            aria-label="Target date"
                          />

                          <button
                            onClick={() => deleteMilestone(m.id)}
                            className="p-1.5 rounded-lg text-[var(--color-ink-subtle)] dark:text-white/30 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer flex-shrink-0"
                            aria-label="Delete milestone"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          {/* Add milestone */}
          <div className="mt-8">
            {!adding ? (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-[var(--color-border-light)] dark:border-white/10 text-[var(--color-ink-muted)] dark:text-white/50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer font-label text-sm w-full justify-center"
              >
                <Plus size={16} aria-hidden="true" /> Add Custom Milestone
              </button>
            ) : (
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-5 border border-[var(--color-primary)] space-y-3">
                <h3 className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white">New Milestone</h3>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Milestone title..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border-light)] dark:border-white/10 bg-[var(--color-sky-bg)] dark:bg-white/5 text-[var(--color-ink)] dark:text-white placeholder-[var(--color-ink-subtle)] dark:placeholder-white/30 text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  onKeyDown={e => e.key === 'Enter' && addMilestone()}
                  autoFocus
                />
                <div className="flex gap-3 flex-wrap">
                  <select
                    value={newPhase}
                    onChange={e => setNewPhase(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border-light)] dark:border-white/10 bg-[var(--color-sky-bg)] dark:bg-white/5 text-[var(--color-ink)] dark:text-white text-sm focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  >
                    {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--color-border-light)] dark:border-white/10 bg-[var(--color-sky-bg)] dark:bg-white/5 text-[var(--color-ink)] dark:text-white text-sm focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addMilestone} className="btn-primary text-sm cursor-pointer">Add</button>
                  <button onClick={() => { setAdding(false); setNewTitle(''); setNewDate('') }} className="btn-outline text-sm cursor-pointer">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

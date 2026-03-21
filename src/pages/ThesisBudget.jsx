import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Printer, BookOpen, Mic2, FlaskConical, Bus, RotateCcw } from 'lucide-react'

const CATEGORIES = [
  {
    id: 'printing',
    label: 'Printing & Binding',
    icon: Printer,
    color: 'var(--color-primary)',
    items: [
      { id: 'softbound', label: 'Soft-bound working copies (3 copies × ₱250)', defaultCost: 750, description: 'Required for panel review' },
      { id: 'hardbound', label: 'Hardbound final copy', defaultCost: 800, description: 'For library submission' },
      { id: 'usb', label: 'USB flash drive with digital copy', defaultCost: 200, description: 'PDF + source files' },
      { id: 'extra-prints', label: 'Extra printed copies for revisions', defaultCost: 400, description: 'Budget for multiple revision rounds' },
    ]
  },
  {
    id: 'defense',
    label: 'Defense Expenses',
    icon: Mic2,
    color: 'var(--color-secondary)',
    items: [
      { id: 'venue', label: 'Venue or room booking (if applicable)', defaultCost: 0, description: 'Some programs charge for room use' },
      { id: 'food', label: 'Light refreshments for panel', defaultCost: 800, description: 'Optional but customary' },
      { id: 'presentation', label: 'Poster printing / presentation materials', defaultCost: 500, description: 'A1/A0 research poster' },
      { id: 'attire', label: 'Business attire', defaultCost: 2000, description: 'If needed' },
    ]
  },
  {
    id: 'research',
    label: 'Research Costs',
    icon: FlaskConical,
    color: 'var(--color-accent)',
    items: [
      { id: 'survey', label: 'Survey platform or data collection tools', defaultCost: 0, description: 'Google Forms is free; others may cost' },
      { id: 'datasets', label: 'Dataset access or API fees', defaultCost: 0, description: 'Check if your university provides access' },
      { id: 'software', label: 'Software licenses (SPSS, MATLAB, etc.)', defaultCost: 0, description: 'DLSU provides some licenses free' },
      { id: 'lab-materials', label: 'Lab materials or consumables', defaultCost: 500, description: 'For experimental studies' },
      { id: 'participants', label: 'Participant incentives / gift cards', defaultCost: 1000, description: 'For studies requiring human participants' },
    ]
  },
  {
    id: 'transport',
    label: 'Transport & Fieldwork',
    icon: Bus,
    color: '#8B5CF6',
    items: [
      { id: 'commute', label: 'Commute to university (multiple visits)', defaultCost: 500, description: 'For consultations, signatures, submissions' },
      { id: 'fieldwork', label: 'Fieldwork transport', defaultCost: 0, description: 'If data collection requires travel' },
    ]
  },
  {
    id: 'academic',
    label: 'Academic Fees',
    icon: BookOpen,
    color: '#EC4899',
    items: [
      { id: 'turnitin', label: 'Turnitin access (if not provided)', defaultCost: 0, description: 'DLSU usually provides access' },
      { id: 'library', label: 'Library / journal access fees', defaultCost: 0, description: 'Check DLSU library subscriptions' },
      { id: 'enrollment', label: 'Thesis enrollment fees', defaultCost: 0, description: 'Varies by program — check your college' },
    ]
  },
]

function formatPHP(amount) {
  return '₱' + Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const STORAGE_KEY = 'animosearch-budget'

const getDefaults = () => {
  const initial = {}
  CATEGORIES.forEach(cat => {
    cat.items.forEach(item => { initial[item.id] = item.defaultCost })
  })
  return initial
}

export default function ThesisBudget() {
  const [costs, setCosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...getDefaults(), ...JSON.parse(saved) } : getDefaults()
    } catch { return getDefaults() }
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(costs)) } catch {}
  }, [costs])

  const updateCost = (id, value) => {
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0
    setCosts(prev => ({ ...prev, [id]: num }))
  }

  const reset = () => setCosts(getDefaults())

  const total = Object.values(costs).reduce((sum, v) => sum + v, 0)
  const catTotals = CATEGORIES.map(cat => ({
    ...cat,
    total: cat.items.reduce((sum, item) => sum + (costs[item.id] || 0), 0)
  }))

  return (
    <>
      <Helmet>
        <title>Thesis Budget Estimator — AnimoSearch</title>
        <meta name="description" content="Estimate your total thesis costs: printing, binding, defense expenses, research fees, and fieldwork. Plan your budget for your DLSU thesis." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Thesis Tools</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Thesis Budget Estimator
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Plan your thesis expenses across printing, defense, research, and academic fees. Edit any amount to fit your situation.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cost inputs */}
            <div className="lg:col-span-2 space-y-6">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon
                return (
                  <div key={cat.id} className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden" data-aos="fade-up">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-border-light)] dark:border-white/10">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cat.color + '20' }}>
                        <Icon size={16} style={{ color: cat.color }} aria-hidden="true" />
                      </div>
                      <h2 className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white flex-1">{cat.label}</h2>
                      <span className="font-label text-xs font-semibold" style={{ color: cat.color }}>
                        {formatPHP(catTotals.find(c => c.id === cat.id)?.total || 0)}
                      </span>
                    </div>
                    <div className="divide-y divide-[var(--color-border-light)] dark:divide-white/5">
                      {cat.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--color-ink)] dark:text-white">{item.label}</p>
                            <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/40">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-sm text-[var(--color-ink-muted)] dark:text-white/50">₱</span>
                            <input
                              type="number"
                              min="0"
                              value={costs[item.id] ?? 0}
                              onChange={e => updateCost(item.id, e.target.value)}
                              className="w-24 px-2 py-1.5 text-right rounded-lg border border-[var(--color-border-light)] dark:border-white/10 bg-[var(--color-sky-bg)] dark:bg-white/5 text-sm text-[var(--color-ink)] dark:text-white focus:outline-none focus:border-[var(--color-primary)]"
                              aria-label={item.label}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary sidebar */}
            <aside className="lg:sticky lg:top-24 self-start space-y-4">
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-5">Budget Summary</h3>
                <dl className="space-y-3 mb-5">
                  {catTotals.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <dt className="text-sm text-[var(--color-ink-muted)] dark:text-white/60">{cat.label}</dt>
                      <dd className="font-semibold text-sm text-[var(--color-ink)] dark:text-white">{formatPHP(cat.total)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="pt-4 border-t border-[var(--color-border-light)] dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white">Total</span>
                    <span className="font-display font-bold text-2xl text-[var(--color-primary)]">{formatPHP(total)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/5 rounded-2xl p-5 border border-[var(--color-secondary)]/20">
                <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed">
                  Tip: Check with your college if printing allowances or research grants are available. DLSU offers financial assistance for thesis-related expenses to qualified students.
                </p>
              </div>

              <button
                onClick={reset}
                className="flex items-center gap-2 justify-center w-full px-4 py-2.5 rounded-xl border border-[var(--color-border-light)] dark:border-white/10 font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all cursor-pointer"
              >
                <RotateCcw size={13} aria-hidden="true" /> Reset to defaults
              </button>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

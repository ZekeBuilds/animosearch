import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Wallet, Save, RotateCcw, Info } from 'lucide-react'

const RATES = {
  Luzon:    { multiplier: 1.0, label: 'Luzon (incl. Palawan)' },
  Visayas:  { multiplier: 1.05, label: 'Visayas (incl. Boracay, Cebu)' },
  Mindanao: { multiplier: 0.9, label: 'Mindanao (incl. Siargao, Davao)' },
}

const COMFORT = {
  Budget: {
    label: 'Budget',
    accommodation: [400, 900],
    food: [300, 600],
    transport: [200, 400],
    activities: [300, 700],
    misc: [150, 300],
  },
  'Mid-range': {
    label: 'Mid-range',
    accommodation: [1500, 4000],
    food: [700, 1500],
    transport: [500, 1000],
    activities: [800, 2000],
    misc: [400, 800],
  },
  Luxury: {
    label: 'Luxury',
    accommodation: [5000, 15000],
    food: [2000, 5000],
    transport: [1500, 4000],
    activities: [2000, 5000],
    misc: [1000, 3000],
  },
}

const avg = ([min, max]) => Math.round((min + max) / 2)

const formatPHP = (n) => `₱${n.toLocaleString()}`

export default function BudgetEstimator() {
  const [islandGroup, setIslandGroup] = useState('Visayas')
  const [days, setDays] = useState(7)
  const [comfort, setComfort] = useState('Mid-range')
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lakbay-budget') || 'null') } catch { return null }
  })

  const calculate = () => {
    const rates = COMFORT[comfort]
    const mult = RATES[islandGroup].multiplier
    const breakdown = {
      accommodation: Math.round(avg(rates.accommodation) * mult * days),
      food: Math.round(avg(rates.food) * mult * days),
      transport: Math.round(avg(rates.transport) * mult * days),
      activities: Math.round(avg(rates.activities) * mult * days),
      misc: Math.round(avg(rates.misc) * mult * days),
    }
    breakdown.total = Object.values(breakdown).reduce((a, b) => a + b, 0)
    setResult({ breakdown, islandGroup, days, comfort })
  }

  const saveEstimate = () => {
    if (!result) return
    const data = { ...result, savedAt: new Date().toLocaleDateString() }
    setSaved(data)
    try { localStorage.setItem('lakbay-budget', JSON.stringify(data)) } catch {}
  }

  const clearSaved = () => {
    setSaved(null)
    try { localStorage.removeItem('lakbay-budget') } catch {}
  }

  const BREAKDOWN_LABELS = {
    accommodation: 'Accommodation',
    food: 'Food & Drinks',
    transport: 'Local Transport',
    activities: 'Tours & Activities',
    misc: 'Miscellaneous',
  }

  return (
    <>
      <Helmet>
        <title>Budget Estimator — Lakbay PH</title>
        <meta name="description" content="Estimate your Philippines travel budget by island group, trip duration, and comfort level." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Plan Your Spend</span>
          <h1 className="font-display font-bold text-white mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Budget Estimator</h1>
          <p className="text-white/60 text-sm">Get a rough daily and total budget estimate for your Philippines trip.</p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Form */}
            <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-8 border border-[var(--color-border-light)] dark:border-white/10" data-aos="fade-up">
              <h2 className="font-display font-bold text-xl text-[var(--color-ink)] dark:text-white mb-6">Trip Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-2 block">Island Group</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(RATES).map(g => (
                      <button key={g} onClick={() => setIslandGroup(g)}
                        className={`py-3 px-2 rounded-xl border font-label text-xs text-center cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                          ${islandGroup === g ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--color-sky-bg)] dark:bg-white/5 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)]'}`}
                        aria-pressed={islandGroup === g}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="days" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-2 block">
                    Trip Duration: <span className="text-[var(--color-primary)] font-bold">{days} days</span>
                  </label>
                  <input id="days" type="range" min="1" max="30" value={days} onChange={e => setDays(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: 'var(--color-primary)' }}
                    aria-label={`Trip duration: ${days} days`} />
                  <div className="flex justify-between text-xs text-[var(--color-ink-muted)] dark:text-white/40 mt-1">
                    <span>1 day</span><span>30 days</span>
                  </div>
                </div>

                <div>
                  <label className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-2 block">Comfort Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(COMFORT).map(c => (
                      <button key={c} onClick={() => setComfort(c)}
                        className={`py-3 px-2 rounded-xl border font-label text-xs text-center cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                          ${comfort === c ? 'bg-[var(--color-secondary)] text-white border-[var(--color-secondary)]' : 'bg-[var(--color-sky-bg)] dark:bg-white/5 text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-secondary)]'}`}
                        aria-pressed={comfort === c}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 p-3 rounded-xl bg-[var(--color-sky-bg)] dark:bg-white/5 text-xs text-[var(--color-ink-muted)] dark:text-white/50">
                    {comfort === 'Budget' && 'Dorms, local eateries, jeepneys, shared boats'}
                    {comfort === 'Mid-range' && 'Guesthouses, local + tourist restaurants, occasional taxis'}
                    {comfort === 'Luxury' && 'Resort hotels, fine dining, private transfers and boats'}
                  </div>
                </div>

                <button onClick={calculate} className="btn-primary w-full justify-center">
                  <Wallet size={16} aria-hidden="true" /> Calculate Budget
                </button>
              </div>
            </div>

            {/* Result */}
            <div>
              {result ? (
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden" data-aos="fade-up">
                  <div className="p-6 border-b border-[var(--color-border-light)] dark:border-white/10 text-center"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' }}>
                    <p className="font-label text-xs text-white/70 mb-1">Estimated Total for {result.days} days in {result.islandGroup}</p>
                    <p className="font-display font-bold text-white" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
                      {formatPHP(result.breakdown.total)}
                    </p>
                    <p className="text-white/70 text-sm mt-1">~{formatPHP(Math.round(result.breakdown.total / result.days))} / day</p>
                  </div>
                  <div className="p-6">
                    <h3 className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-4">Breakdown</h3>
                    <div className="space-y-3">
                      {Object.entries(result.breakdown).filter(([k]) => k !== 'total').map(([key, val]) => (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[var(--color-ink)] dark:text-white">{BREAKDOWN_LABELS[key]}</span>
                            <span className="font-semibold text-[var(--color-ink)] dark:text-white">{formatPHP(val)}</span>
                          </div>
                          <div className="h-1.5 bg-[var(--color-sky-muted)] dark:bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(val / result.breakdown.total) * 100}%`, background: 'var(--color-primary)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-[var(--color-sky-bg)] dark:bg-white/5 rounded-xl flex gap-3">
                      <Info size={16} className="text-[var(--color-ink-subtle)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 leading-relaxed">
                        These are rough estimates based on average traveler spending in 2024. Actual costs vary based on season, specific destinations, group size, and personal habits. Always add a 20% buffer.
                      </p>
                    </div>
                    <button onClick={saveEstimate}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[var(--color-border-light)] dark:border-white/20 font-label text-xs text-[var(--color-primary)] hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                      <Save size={14} aria-hidden="true" /> Save This Estimate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-dashed border-[var(--color-border-light)] dark:border-white/10 p-8">
                  <Wallet size={40} className="text-[var(--color-ink-subtle)] mb-3 opacity-30" aria-hidden="true" />
                  <p className="font-display text-lg text-[var(--color-ink)] dark:text-white mb-2">No estimate yet</p>
                  <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50">Fill in the form and click "Calculate Budget"</p>
                </div>
              )}

              {saved && (
                <div className="mt-4 bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-5" data-aos="fade-up">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-[var(--color-ink)] dark:text-white">Saved Estimate</h3>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50">{saved.days} days in {saved.islandGroup} · {saved.comfort} · Saved {saved.savedAt}</p>
                    </div>
                    <button onClick={clearSaved} className="text-xs text-red-400 hover:text-red-500 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded">
                      <RotateCcw size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="font-display font-bold text-xl text-[var(--color-primary)]">{formatPHP(saved.breakdown.total)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { FileText, Shirt, Waves, Droplets, Heart, Smartphone, Plus, Trash2, RotateCcw, CheckCircle2 } from 'lucide-react'
import { packingCategories } from '../data/packingItems'

const ICON_MAP = { FileText, Shirt, Waves, Droplets, Heart, Smartphone }
const STORAGE_KEY = 'lakbay-packing'

const loadState = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export default function PackingList() {
  const [checked, setChecked] = useState(() => loadState())
  const [customItems, setCustomItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lakbay-packing-custom') || '[]') } catch { return [] }
  })
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)) } catch {}
  }, [checked])

  useEffect(() => {
    try { localStorage.setItem('lakbay-packing-custom', JSON.stringify(customItems)) } catch {}
  }, [customItems])

  const allItems = [
    ...packingCategories.flatMap(c => c.items.map(item => item.id)),
    ...customItems.map(item => item.id)
  ]
  const checkedCount = allItems.filter(id => checked[id]).length
  const totalCount = allItems.length
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const addCustom = () => {
    const label = newItem.trim()
    if (!label) return
    const item = { id: `custom-${Date.now()}`, label, custom: true }
    setCustomItems(prev => [...prev, item])
    setNewItem('')
  }

  const removeCustom = (id) => {
    setCustomItems(prev => prev.filter(i => i.id !== id))
    setChecked(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  const resetAll = () => {
    if (confirm('Reset all packing list items?')) { setChecked({}); setCustomItems([]) }
  }

  return (
    <>
      <Helmet>
        <title>Packing List — Lakbay PH</title>
        <meta name="description" content="Interactive Philippines travel packing checklist. Track what you've packed, add custom items, and never forget the essentials." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Travel Smart</span>
          <h1 className="font-display font-bold text-white mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Packing Checklist</h1>
          <p className="text-white/60 text-sm">Check off items as you pack. Progress saves automatically.</p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-8">

          {/* Progress bar */}
          <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 mb-8 border border-[var(--color-border-light)] dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-display font-bold text-2xl text-[var(--color-primary)]">{checkedCount}<span className="text-base font-normal text-[var(--color-ink-muted)] dark:text-white/50"> / {totalCount} packed</span></p>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50">{progress}% complete</p>
              </div>
              <div className="flex gap-2">
                {progress === 100 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                    <CheckCircle2 size={16} aria-hidden="true" />
                    <span className="font-label text-xs">All Packed!</span>
                  </div>
                )}
                <button onClick={resetAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 font-label text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                  <RotateCcw size={14} aria-hidden="true" /> Reset
                </button>
              </div>
            </div>
            <div className="h-3 bg-[var(--color-sky-muted)] dark:bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${progress}% packed`}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: progress === 100 ? '#10B981' : 'var(--color-primary)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packingCategories.map(cat => {
              const Icon = ICON_MAP[cat.icon] || FileText
              const catChecked = cat.items.filter(i => checked[i.id]).length
              return (
                <div key={cat.id} className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden" data-aos="fade-up">
                  <div className="flex items-center gap-3 px-5 py-4 bg-[var(--color-sky-bg)] dark:bg-white/5 border-b border-[var(--color-border-light)] dark:border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center">
                      <Icon size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
                    </div>
                    <h2 className="font-display font-semibold text-base text-[var(--color-ink)] dark:text-white flex-1">{cat.label}</h2>
                    <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">{catChecked}/{cat.items.length}</span>
                  </div>
                  <ul className="p-4 space-y-2" role="list">
                    {cat.items.map(item => (
                      <li key={item.id}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked[item.id] ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-light)] dark:border-white/20 group-hover:border-[var(--color-primary)]'}`}>
                            {checked[item.id] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} className="sr-only" aria-label={item.label} />
                          <span className={`text-sm flex-1 transition-colors ${checked[item.id] ? 'line-through text-[var(--color-ink-subtle)] dark:text-white/30' : 'text-[var(--color-ink)] dark:text-white/80'}`}>
                            {item.label}
                            {item.essential && <span className="ml-1.5 tag tag-orange" style={{ fontSize: '0.55rem' }}>Essential</span>}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}

            {/* Custom items */}
            <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden" data-aos="fade-up">
              <div className="flex items-center gap-3 px-5 py-4 bg-[var(--color-sky-bg)] dark:bg-white/5 border-b border-[var(--color-border-light)] dark:border-white/10">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/20 flex items-center justify-center">
                  <Plus size={16} className="text-[var(--color-secondary)]" aria-hidden="true" />
                </div>
                <h2 className="font-display font-semibold text-base text-[var(--color-ink)] dark:text-white flex-1">Custom Items</h2>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                    placeholder="Add item…"
                    className="input text-sm flex-1"
                    aria-label="New custom item"
                  />
                  <button onClick={addCustom} className="btn-primary py-2 px-4" aria-label="Add item">
                    <Plus size={16} aria-hidden="true" />
                  </button>
                </div>
                {customItems.length === 0 ? (
                  <p className="text-xs text-[var(--color-ink-subtle)] dark:text-white/30 text-center py-4 italic">No custom items yet</p>
                ) : (
                  <ul className="space-y-2" role="list">
                    {customItems.map(item => (
                      <li key={item.id} className="flex items-center gap-3 group">
                        <label className="flex items-center gap-3 flex-1 cursor-pointer">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked[item.id] ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-light)] dark:border-white/20 group-hover:border-[var(--color-primary)]'}`}>
                            {checked[item.id] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <input type="checkbox" checked={!!checked[item.id]} onChange={() => toggle(item.id)} className="sr-only" aria-label={item.label} />
                          <span className={`text-sm transition-colors ${checked[item.id] ? 'line-through text-[var(--color-ink-subtle)] dark:text-white/30' : 'text-[var(--color-ink)] dark:text-white/80'}`}>{item.label}</span>
                        </label>
                        <button onClick={() => removeCustom(item.id)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                          aria-label={`Remove ${item.label}`}>
                          <Trash2 size={12} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

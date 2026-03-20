import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Trash2, MoveUp, MoveDown, Download, RotateCcw, MapPin, Calendar } from 'lucide-react'
import { destinations } from '../data/destinations'

const STORAGE_KEY = 'lakbay-itinerary'

const loadItinerary = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

const saveItinerary = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export default function ItineraryBuilder() {
  const [days, setDays] = useState(() => loadItinerary())
  const [search, setSearch] = useState('')
  const [selectedDay, setSelectedDay] = useState(1)

  useEffect(() => { saveItinerary(days) }, [days])

  const addDay = () => setDays(d => [...d, { id: Date.now(), destinations: [] }])

  const removeDay = (dayId) => setDays(d => d.filter(day => day.id !== dayId))

  const addDestination = (destSlug) => {
    const dest = destinations.find(d => d.slug === destSlug)
    if (!dest) return
    setDays(d => d.map((day, i) => {
      if (i + 1 === selectedDay) {
        if (day.destinations.some(dd => dd.slug === destSlug)) return day
        return { ...day, destinations: [...day.destinations, { slug: dest.slug, name: dest.name, province: dest.province, image_url: dest.image_url }] }
      }
      return day
    }))
  }

  const removeFromDay = (dayId, destSlug) => {
    setDays(d => d.map(day => day.id === dayId
      ? { ...day, destinations: day.destinations.filter(dd => dd.slug !== destSlug) }
      : day
    ))
  }

  const moveDay = (idx, dir) => {
    const newDays = [...days]
    const swap = idx + dir
    if (swap < 0 || swap >= days.length) return
    ;[newDays[idx], newDays[swap]] = [newDays[swap], newDays[idx]]
    setDays(newDays)
  }

  const exportText = () => {
    let text = 'My Philippines Itinerary — Lakbay PH\n\n'
    days.forEach((day, i) => {
      text += `Day ${i + 1}:\n`
      if (day.destinations.length === 0) text += '  (No destinations added)\n'
      else day.destinations.forEach(d => { text += `  • ${d.name}, ${d.province}\n` })
      text += '\n'
    })
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lakbay-itinerary.txt'; a.click()
  }

  const clearAll = () => { if (confirm('Clear entire itinerary?')) { setDays([]); saveItinerary([]) } }

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.province.toLowerCase().includes(search.toLowerCase())
  )

  const totalDestinations = days.reduce((sum, d) => sum + d.destinations.length, 0)

  return (
    <>
      <Helmet>
        <title>Itinerary Builder — Lakbay PH</title>
        <meta name="description" content="Build your Philippines day-by-day itinerary. Add destinations to each day, reorder days, and export your plan." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Plan Your Adventure</span>
          <h1 className="font-display font-bold text-white mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Itinerary Builder</h1>
          <p className="text-white/60 text-sm">Build your day-by-day Philippines trip plan. Saved automatically to your browser.</p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-8">

          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-8 bg-white dark:bg-[var(--color-card-dark)] rounded-2xl px-6 py-4 border border-[var(--color-border-light)] dark:border-white/10">
            <div className="flex gap-6">
              <div>
                <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Days Planned</span>
                <p className="font-display font-bold text-xl text-[var(--color-primary)]">{days.length}</p>
              </div>
              <div>
                <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Destinations</span>
                <p className="font-display font-bold text-xl text-[var(--color-secondary)]">{totalDestinations}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={exportText} disabled={days.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white font-label text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                <Download size={14} aria-hidden="true" /> Export
              </button>
              <button onClick={clearAll} disabled={days.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/30 text-red-500 font-label text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                <RotateCcw size={14} aria-hidden="true" /> Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Destination picker */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-[var(--color-ink)] dark:text-white">Add Destinations</h2>
                <div className="flex items-center gap-2">
                  <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50">Add to Day:</span>
                  <select
                    value={selectedDay}
                    onChange={e => setSelectedDay(Number(e.target.value))}
                    className="input py-1.5 px-3 w-auto text-sm"
                    aria-label="Select day to add destination to"
                    disabled={days.length === 0}
                  >
                    {days.map((_, i) => <option key={i} value={i + 1}>Day {i + 1}</option>)}
                  </select>
                </div>
              </div>
              <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations…" className="input mb-4" aria-label="Search destinations to add" />
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filtered.map(dest => (
                  <button key={dest.id} onClick={() => addDestination(dest.slug)}
                    disabled={days.length === 0}
                    className="w-full flex items-center gap-3 bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-3 border border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary)] transition-all text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={dest.image_url} alt="" className="w-full h-full object-cover" loading="lazy" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-[var(--color-ink)] dark:text-white truncate">{dest.name}</p>
                      <p className="flex items-center gap-1 text-xs text-[var(--color-ink-muted)] dark:text-white/50">
                        <MapPin size={10} aria-hidden="true" />{dest.province}
                      </p>
                    </div>
                    <Plus size={16} className="text-[var(--color-primary)] flex-shrink-0" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Itinerary days */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-[var(--color-ink)] dark:text-white">Your Itinerary</h2>
                <button onClick={addDay} className="flex items-center gap-2 btn-primary py-2 px-4">
                  <Plus size={14} aria-hidden="true" /> Add Day
                </button>
              </div>

              {days.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-dashed border-[var(--color-border-light)] dark:border-white/10">
                  <Calendar size={36} className="text-[var(--color-ink-subtle)] mb-3 opacity-40" aria-hidden="true" />
                  <p className="font-display text-lg text-[var(--color-ink)] dark:text-white mb-2">No days yet</p>
                  <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/50 mb-4">Click "Add Day" to start building your itinerary</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {days.map((day, i) => (
                    <div key={day.id} className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-3.5 bg-[var(--color-sky-bg)] dark:bg-white/5 border-b border-[var(--color-border-light)] dark:border-white/10">
                        <h3 className="font-display font-semibold text-base text-[var(--color-ink)] dark:text-white">Day {i + 1}</h3>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveDay(i, -1)} disabled={i === 0}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-ink-muted)] dark:text-white/50 hover:bg-[var(--color-sky-muted)] dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
                            aria-label="Move day up">
                            <MoveUp size={14} aria-hidden="true" />
                          </button>
                          <button onClick={() => moveDay(i, 1)} disabled={i === days.length - 1}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-ink-muted)] dark:text-white/50 hover:bg-[var(--color-sky-muted)] dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
                            aria-label="Move day down">
                            <MoveDown size={14} aria-hidden="true" />
                          </button>
                          <button onClick={() => removeDay(day.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                            aria-label={`Remove Day ${i + 1}`}>
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        {day.destinations.length === 0 ? (
                          <p className="text-xs text-[var(--color-ink-subtle)] dark:text-white/30 text-center py-3 italic">No destinations — select Day {i + 1} and add from the list</p>
                        ) : (
                          <ul className="space-y-2" role="list">
                            {day.destinations.map(dest => (
                              <li key={dest.slug} className="flex items-center gap-3 group">
                                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
                                  <img src={dest.image_url} alt="" className="w-full h-full object-cover" loading="lazy" aria-hidden="true" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[var(--color-ink)] dark:text-white truncate">{dest.name}</p>
                                  <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50">{dest.province}</p>
                                </div>
                                <button onClick={() => removeFromDay(day.id, dest.slug)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--color-ink-subtle)] dark:text-white/30 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400"
                                  aria-label={`Remove ${dest.name}`}>
                                  <Trash2 size={12} aria-hidden="true" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

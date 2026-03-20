import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, ChevronRight, ArrowRight } from 'lucide-react'
import { islandGroups } from '../data/regions'
import { destinations } from '../data/destinations'

export default function Regions() {
  const [activeGroup, setActiveGroup] = useState(null)
  const [activeRegion, setActiveRegion] = useState(null)

  const selectedGroup = activeGroup ? islandGroups.find(g => g.id === activeGroup) : null
  const groupDestinations = selectedGroup
    ? destinations.filter(d => d.island_group === selectedGroup.name)
    : []

  return (
    <>
      <Helmet>
        <title>Regions Explorer — Lakbay PH</title>
        <meta name="description" content="Explore the Philippines by island group and region. Luzon, Visayas, and Mindanao — discover destinations across 17 regions." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Navigate the Archipelago</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Regions Explorer</h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            The Philippines is divided into three main island groups. Click a group to explore its regions and destinations.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-12">

          {/* Island Group selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {islandGroups.map(group => (
              <button
                key={group.id}
                onClick={() => { setActiveGroup(activeGroup === group.id ? null : group.id); setActiveRegion(null) }}
                className={`relative group rounded-2xl overflow-hidden aspect-[16/9] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-all ${activeGroup === group.id ? 'ring-4 ring-[var(--color-primary)]' : ''}`}
                aria-pressed={activeGroup === group.id}
                aria-label={`${activeGroup === group.id ? 'Collapse' : 'Expand'} ${group.name}`}
              >
                <img src={group.image_url} alt={group.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="w-2.5 h-2.5 rounded-full mb-2" style={{ background: group.color }} aria-hidden="true" />
                  <h2 className="font-display font-bold text-white text-xl mb-0.5">{group.name}</h2>
                  <p className="text-white/70 text-xs">{group.tagline}</p>
                  {activeGroup === group.id && (
                    <span className="mt-2 inline-block font-label text-xs text-[var(--color-accent)]">Selected</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Region detail panel */}
          {selectedGroup && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" data-aos="fade-up">
              {/* Region list */}
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-4">
                  Regions in {selectedGroup.name}
                </h3>
                <ul className="space-y-1" role="list">
                  {selectedGroup.regions.map(region => (
                    <li key={region.id}>
                      <button
                        onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
                        className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                          ${activeRegion === region.id
                            ? 'bg-[var(--color-sky-bg)] dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                            : 'text-[var(--color-ink-muted)] dark:text-white/70 hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5'
                          }`}
                        aria-pressed={activeRegion === region.id}
                      >
                        <span className="text-sm font-medium">{region.name}</span>
                        <ChevronRight size={14} className={`transition-transform ${activeRegion === region.id ? 'rotate-90' : ''}`} aria-hidden="true" />
                      </button>
                      {activeRegion === region.id && (
                        <div className="px-3 pb-2">
                          <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 mt-1 mb-2">Highlights:</p>
                          <div className="flex flex-wrap gap-1">
                            {region.destinations.map(d => (
                              <span key={d} className="tag tag-blue">{d}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Quick facts */}
                <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] dark:border-white/10">
                  <h4 className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-3">Quick Facts</h4>
                  {Object.entries(selectedGroup.quick_facts).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--color-ink-muted)] dark:text-white/50 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-[var(--color-ink)] dark:text-white">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Destinations in group */}
              <div className="lg:col-span-2">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-4">
                  Destinations in {selectedGroup.name} ({groupDestinations.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupDestinations.map(dest => (
                    <Link key={dest.id} to={`/destinations/${dest.slug}`}
                      className="group flex gap-4 bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-4 border border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={dest.image_url} alt={dest.name} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110" loading="lazy" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <p className="font-display font-semibold text-base text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors truncate">{dest.name}</p>
                        <p className="flex items-center gap-1 text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5">
                          <MapPin size={10} aria-hidden="true" /> {dest.province}
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {dest.activities.slice(0, 2).map(a => (
                            <span key={a} className="tag tag-teal">{a}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!selectedGroup && (
            <div className="text-center py-12 text-[var(--color-ink-muted)] dark:text-white/50">
              <MapPin size={40} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="font-display text-lg">Select an island group above to explore its regions and destinations.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

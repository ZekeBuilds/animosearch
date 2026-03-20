import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Sun, Navigation, Wallet, Shield, Users, MessageCircle, ChevronDown } from 'lucide-react'
import { travelTips, quickFacts } from '../data/tips'

const ICONS = { Sun, Navigation, Wallet, Shield, Users, MessageCircle }

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-[var(--color-border-light)] dark:border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] bg-white dark:bg-[var(--color-card-dark)] hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-sm text-[var(--color-ink)] dark:text-white">{item.heading}</span>
        <ChevronDown size={16} className={`text-[var(--color-primary)] transition-transform duration-200 flex-shrink-0 ml-3 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="px-5 py-4 bg-[var(--color-sky-bg)] dark:bg-[#0F1923]/50 border-t border-[var(--color-border-light)] dark:border-white/10">
          <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">{item.content}</p>
        </div>
      )}
    </div>
  )
}

export default function TravelTips() {
  const [openItems, setOpenItems] = useState({})
  const [activeSection, setActiveSection] = useState('best-time')

  const toggle = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const activeData = travelTips.find(t => t.id === activeSection)
  const ActiveIcon = activeData ? (ICONS[activeData.icon] || Sun) : Sun

  return (
    <>
      <Helmet>
        <title>Travel Tips — Lakbay PH</title>
        <meta name="description" content="Essential Philippines travel tips: best time to visit, how to get around, budget guide, safety tips, local etiquette, and language basics." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Plan Your Trip</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Travel Tips</h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Everything you need to know before visiting the Philippines — from the best time to go, to how to get around, budget wisely, and connect with locals.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

            {/* Sidebar nav */}
            <aside className="lg:col-span-1">
              <nav aria-label="Travel tips sections">
                <ul className="space-y-1 sticky top-24" role="list">
                  {travelTips.map(tip => {
                    const Icon = ICONS[tip.icon] || Sun
                    return (
                      <li key={tip.id}>
                        <button
                          onClick={() => setActiveSection(tip.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                            ${activeSection === tip.id
                              ? 'bg-[var(--color-primary)] text-white shadow-md'
                              : 'text-[var(--color-ink-muted)] dark:text-white/60 hover:bg-white dark:hover:bg-white/5'
                            }`}
                          aria-current={activeSection === tip.id ? 'page' : undefined}
                        >
                          <Icon size={16} aria-hidden="true" />
                          <span className="text-sm font-medium">{tip.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Quick Facts box */}
              <div className="mt-8 bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-5 border border-[var(--color-border-light)] dark:border-white/10 sticky top-[calc(24px+theme(spacing.64))]" style={{ top: 'auto', marginTop: '2rem' }}>
                <h3 className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white mb-4">Philippines Quick Facts</h3>
                <dl className="space-y-3">
                  {quickFacts.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40">{label}</dt>
                      <dd className="text-sm font-medium text-[var(--color-ink)] dark:text-white mt-0.5">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-3" aria-live="polite">
              {activeData && (
                <div data-aos="fade-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center">
                      <ActiveIcon size={20} className="text-[var(--color-primary)]" aria-hidden="true" />
                    </div>
                    <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white">{activeData.title}</h2>
                  </div>

                  <p className="text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed mb-8 text-[0.9375rem]">{activeData.intro}</p>

                  <div className="space-y-3" role="list">
                    {activeData.items.map((item, idx) => (
                      <AccordionItem
                        key={idx}
                        item={item}
                        isOpen={!!openItems[`${activeData.id}-${idx}`]}
                        onToggle={() => toggle(activeData.id, idx)}
                      />
                    ))}
                  </div>

                  {/* Callout highlight */}
                  <div className="mt-8 p-5 rounded-2xl border-l-4 border-[var(--color-secondary)] bg-[var(--color-secondary)]/5 dark:bg-[var(--color-secondary)]/10">
                    <p className="font-semibold text-sm text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary-light)] mb-1">Pro Tip</p>
                    <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70">
                      {activeSection === 'best-time' && 'Book flights and accommodations at least 4-6 weeks ahead for peak season (December-February) — popular islands like Boracay, El Nido, and Siargao fill up fast.'}
                      {activeSection === 'getting-around' && 'Download the Grab app before you arrive and top up a Globe or Smart SIM at the airport — this combination will handle most of your transport needs.'}
                      {activeSection === 'budget' && 'Withdraw cash at bank ATMs rather than hotel ATMs for better exchange rates. BDO, BPI, and Metrobank ATMs are widely available and accept international cards.'}
                      {activeSection === 'safety' && 'Register your trip with your country\'s embassy in Manila before traveling to remote areas like Mindanao or smaller islands far from the mainland.'}
                      {activeSection === 'etiquette' && 'If invited to a Filipino home, always bring a small gift (pastries, fruit, or local delicacies work well) and expect to be offered food immediately upon arrival.'}
                      {activeSection === 'language' && 'English is widely spoken and understood throughout the Philippines — you\'ll have no trouble communicating in cities, tourist areas, and even most rural communities.'}
                    </p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

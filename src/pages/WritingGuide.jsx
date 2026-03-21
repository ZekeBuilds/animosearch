import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, Lightbulb, FileEdit, FlaskConical, PenLine, PenTool, Mic2, Upload, BookOpen, CheckSquare } from 'lucide-react'
import { guideSections, quickFacts } from '../data/guideContent'

const ICON_MAP = {
  Lightbulb, FileEdit, FlaskConical,
  PenLine, PenTool,
  Mic2, Presentation: Mic2,
  Upload, CheckSquare,
  BookOpen,
}

function AccordionItem({ heading, content }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[var(--color-border-light)] dark:border-white/10 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm text-[var(--color-ink)] dark:text-white pr-4">{heading}</span>
        <ChevronDown
          size={16}
          className={`text-[var(--color-primary)] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="pb-4 pr-6">
          <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  )
}

export default function WritingGuide() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id)
  const current = guideSections.find(s => s.id === activeSection)
  const Icon = ICON_MAP[current.icon] || BookOpen

  return (
    <>
      <Helmet>
        <title>Thesis Writing Guide — AnimoSearch</title>
        <meta name="description" content="A complete guide to writing your DLSU thesis — from choosing a topic to final submission. Covers proposal, methodology, defense, and Animo Repository upload." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Research Guidance</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Thesis Writing Guide
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            A step-by-step guide covering every phase of the DLSU thesis process. From picking a topic to uploading to Animo Repository.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Section nav */}
            <aside>
              <nav aria-label="Guide sections">
                <ul className="space-y-1">
                  {guideSections.map((section, idx) => {
                    const SIcon = ICON_MAP[section.icon] || BookOpen
                    return (
                      <li key={section.id}>
                        <button
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                            activeSection === section.id
                              ? 'bg-[var(--color-primary)] text-white'
                              : 'text-[var(--color-ink-muted)] dark:text-white/70 hover:bg-white dark:hover:bg-[var(--color-card-dark)]'
                          }`}
                          aria-pressed={activeSection === section.id}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-label text-xs font-bold ${
                            activeSection === section.id ? 'bg-white/20 text-white' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="text-sm font-medium">{section.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Quick facts */}
              <div className="mt-8 bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-5 border border-[var(--color-border-light)] dark:border-white/10">
                <h3 className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-3">Quick Facts</h3>
                <ul className="space-y-2.5">
                  {quickFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] flex-shrink-0 mt-1.5" aria-hidden="true" />
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed">
                        <span className="font-semibold text-[var(--color-ink)] dark:text-white/80">{fact.label}:</span> {fact.value}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-3" data-aos="fade-up">
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden">

                {/* Section header */}
                <div className="p-6 border-b border-[var(--color-border-light)] dark:border-white/10 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-[var(--color-primary)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl text-[var(--color-ink)] dark:text-white mb-1">{current.title}</h2>
                    <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">{current.intro}</p>
                  </div>
                </div>

                {/* Accordion items */}
                <div className="p-6">
                  {current.items.map(item => (
                    <AccordionItem key={item.heading} heading={item.heading} content={item.content} />
                  ))}
                </div>

                {/* Pro tip */}
                {current.proTip && (
                  <div className="mx-6 mb-6 p-4 bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/5 rounded-xl border border-[var(--color-secondary)]/20">
                    <div className="flex items-start gap-3">
                      <Lightbulb size={16} className="text-[var(--color-secondary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">
                        <span className="font-semibold text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary)]">Pro tip: </span>
                        {current.proTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prev / Next */}
              {(() => {
                const idx = guideSections.findIndex(s => s.id === activeSection)
                const prev = idx > 0 ? guideSections[idx - 1] : null
                const next = idx < guideSections.length - 1 ? guideSections[idx + 1] : null
                return (
                  <div className="flex justify-between mt-4 gap-3">
                    {prev && (
                      <button
                        onClick={() => setActiveSection(prev.id)}
                        className="btn-outline text-sm cursor-pointer"
                        aria-label={`Previous: ${prev.title}`}
                      >
                        Previous
                      </button>
                    )}
                    {next && (
                      <button
                        onClick={() => setActiveSection(next.id)}
                        className="btn-primary text-sm ml-auto cursor-pointer"
                        aria-label={`Next: ${next.title}`}
                      >
                        Next Section
                      </button>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

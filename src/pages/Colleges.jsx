import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, BookOpen, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllTheses } from '../lib/thesesApi'
import { colleges } from '../data/colleges'

export default function Colleges() {
  const location = useLocation()
  const [activeCollege, setActiveCollege] = useState(location.state?.college || null)
  const [activeDept, setActiveDept] = useState(null)

  useEffect(() => {
    if (location.state?.college && location.state.college !== activeCollege) {
      setActiveCollege(location.state.college)
      setActiveDept(null)
    }
  }, [location.state?.college])

  const { data: theses = [] } = useQuery({ queryKey: ['theses'], queryFn: fetchAllTheses })

  const collegeCounts = useMemo(() => {
    const counts = {}
    theses.forEach(t => { counts[t.college] = (counts[t.college] || 0) + 1 })
    return counts
  }, [theses])

  const selectedCollege = activeCollege ? colleges.find(c => c.id === activeCollege) : null
  const collegeTheses = selectedCollege
    ? theses.filter(t => t.college === selectedCollege.abbreviation)
    : []
  const deptTheses = activeDept
    ? collegeTheses.filter(t => t.department === activeDept)
    : collegeTheses

  return (
    <>
      <Helmet>
        <title>Colleges & Departments — AnimoSearch</title>
        <meta name="description" content="Browse DLSU research by college and department. Explore CCS, COE, COB, CLA, COS, SOE and more." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Explore by College</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Colleges & Departments
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            DLSU has {colleges.length} colleges spanning computer studies, engineering, business, liberal arts, science, and education. Click a college to explore its departments and theses.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">

          {/* College list */}
          <div className="border border-[var(--color-border-light)] dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-card-dark)] divide-y divide-[var(--color-border-light)] dark:divide-white/10 mb-12">
            {colleges.map((college, i) => (
              <button
                key={college.id}
                onClick={() => {
                  setActiveCollege(activeCollege === college.id ? null : college.id)
                  setActiveDept(null)
                }}
                className={`w-full group flex items-center gap-4 px-5 py-4 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] transition-colors ${
                  activeCollege === college.id
                    ? 'bg-[var(--color-sky-bg)] dark:bg-[var(--color-primary)]/10'
                    : 'hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5'
                }`}
                style={{ animation: `fadeInUp 0.4s ease ${i * 40}ms both` }}
                aria-pressed={activeCollege === college.id}
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0 min-h-[2rem]"
                  style={{ background: college.color }}
                  aria-hidden="true"
                />
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: college.color + '18' }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: college.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-display font-bold text-base transition-colors ${activeCollege === college.id ? '' : 'text-[var(--color-ink)] dark:text-white'}`}
                    style={activeCollege === college.id ? { color: college.color } : {}}
                  >
                    {college.abbreviation}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 leading-tight">
                    {college.name}
                  </p>
                </div>
                <p className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 flex-shrink-0">
                  {(collegeCounts[college.abbreviation] ?? 0).toLocaleString()} theses
                </p>
                <ChevronRight
                  size={16}
                  className={`flex-shrink-0 transition-transform duration-200 ${activeCollege === college.id ? 'rotate-90' : ''}`}
                  style={{ color: activeCollege === college.id ? college.color : 'var(--color-ink-subtle)' }}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          {/* College detail */}
          {selectedCollege && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

              {/* Department list + research areas */}
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-4">
                  {selectedCollege.name}
                </h3>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 mb-5 leading-relaxed">
                  {selectedCollege.description}
                </p>

                <h4 className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-3">Departments</h4>
                <ul className="space-y-1 mb-6" role="list">
                  <li>
                    <button
                      onClick={() => setActiveDept(null)}
                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                        ${!activeDept
                          ? 'bg-[var(--color-sky-bg)] dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                          : 'text-[var(--color-ink-muted)] dark:text-white/70 hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5'
                        }`}
                      aria-pressed={!activeDept}
                    >
                      <span className="text-sm font-medium">All Departments</span>
                      <span className="font-label text-xs opacity-60">{collegeTheses.length}</span>
                    </button>
                  </li>
                  {selectedCollege.departments.map(dept => {
                    const count = collegeTheses.filter(t => t.department === dept.name).length
                    return (
                      <li key={dept.id}>
                        <button
                          onClick={() => setActiveDept(activeDept === dept.name ? null : dept.name)}
                          className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                            ${activeDept === dept.name
                              ? 'bg-[var(--color-sky-bg)] dark:bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                              : 'text-[var(--color-ink-muted)] dark:text-white/70 hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5'
                            }`}
                          aria-pressed={activeDept === dept.name}
                        >
                          <span className="text-sm font-medium">{dept.name}</span>
                          {count > 0 && <span className="font-label text-xs opacity-60">{count}</span>}
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <h4 className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 mb-3">Research Areas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCollege.researchAreas.map(area => (
                    <span key={area} className="tag tag-blue">{area}</span>
                  ))}
                </div>
              </div>

              {/* Theses in college/dept */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white">
                    {activeDept || selectedCollege.abbreviation} Theses ({deptTheses.length})
                  </h3>
                  <Link
                    to={`/theses`}
                    className="flex items-center gap-1 font-label text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors cursor-pointer"
                  >
                    All Theses <ArrowRight size={12} aria-hidden="true" />
                  </Link>
                </div>

                {deptTheses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-dashed border-[var(--color-border-light)] dark:border-white/10">
                    <BookOpen size={32} className="text-[var(--color-ink-subtle)] mb-3 opacity-30" aria-hidden="true" />
                    <p className="font-display text-base text-[var(--color-ink)] dark:text-white">No theses in this dataset for this department.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {deptTheses.map(thesis => (
                      <Link
                        key={thesis.id}
                        to={`/theses/${thesis.slug}`}
                        className="group flex gap-4 bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-4 border border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                      >
                        <div
                          className="w-1 rounded-full flex-shrink-0 self-stretch"
                          style={{ background: selectedCollege.color }}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-semibold text-sm text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-1">
                            {thesis.title}
                          </p>
                          <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50">
                            {thesis.author} · {thesis.department} · {thesis.year}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-[var(--color-ink-subtle)] dark:text-white/30 flex-shrink-0 self-center group-hover:text-[var(--color-primary)] transition-colors" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {!selectedCollege && (
            <div className="text-center py-12 text-[var(--color-ink-muted)] dark:text-white/50">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" aria-hidden="true" />
              <p className="font-display text-lg">Select a college above to explore its departments and theses.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

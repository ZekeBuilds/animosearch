import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts'
import { TrendingUp, BookOpen, Building2, Hash } from 'lucide-react'
import { fetchAllTheses } from '../lib/thesesApi'

const COLLEGE_COLORS = {
  CCS:    '#005E3A',
  COE:    '#E63946',
  COB:    '#F77F00',
  CLA:    '#7B2D8B',
  COS:    '#2EC4B6',
  BAGCED: '#F4A261',
  SOE:    '#457B9D',
  TDSOL:  '#1D3557',
}

const COLLEGE_SHORT = {
  CCS:    'Computer Studies',
  COE:    'Engineering',
  COB:    'Business',
  CLA:    'Liberal Arts',
  COS:    'Science',
  BAGCED: 'Education',
  SOE:    'Economics',
  TDSOL:  'Law',
}

const HEAT_YEARS = Array.from({ length: 15 }, (_, i) => 2010 + i)

function StatCard({ label, value, Icon }) {
  return (
    <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-xl border border-[var(--color-border-light)] dark:border-white/10 p-5">
      <Icon size={16} className="text-[var(--color-primary)] mb-2" aria-hidden="true" />
      <p className="font-stat text-2xl font-bold text-[var(--color-ink)] dark:text-white leading-none mb-1">{value}</p>
      <p className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40">{label}</p>
    </div>
  )
}

function YearTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1A2E20] border border-[var(--color-border-light)] dark:border-white/10 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-label font-semibold text-[var(--color-ink)] dark:text-white mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

function CollegeTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1A2E20] border border-[var(--color-border-light)] dark:border-white/10 rounded-xl p-3 shadow-xl text-sm">
      <p className="font-semibold text-[var(--color-ink)] dark:text-white">{payload[0].payload.college}</p>
      <p className="font-mono text-[var(--color-ink-muted)] dark:text-white/60">{payload[0].value} theses</p>
    </div>
  )
}

export default function Trends() {
  const navigate = useNavigate()

  const { data: theses = [], isLoading } = useQuery({
    queryKey: ['theses'],
    queryFn: fetchAllTheses,
  })

  const { yearData, collegeData, keywordData, heatGrid, stats } = useMemo(() => {
    if (!theses.length) return { yearData: [], collegeData: [], keywordData: [], heatGrid: null, stats: {} }

    const currentYear = new Date().getFullYear()

    // By year (2000–present)
    const yearMap = {}
    theses.forEach(t => {
      if (!t.year || t.year < 2000 || t.year > currentYear) return
      if (!yearMap[t.year]) yearMap[t.year] = { year: t.year, graduate: 0, doctoral: 0, undergraduate: 0 }
      const lvl = t.degreeLevel || 'graduate'
      if (lvl === 'doctoral') yearMap[t.year].doctoral++
      else if (lvl === 'undergraduate') yearMap[t.year].undergraduate++
      else yearMap[t.year].graduate++
    })
    const yearData = Object.values(yearMap).sort((a, b) => a.year - b.year)

    // By college
    const colMap = {}
    theses.forEach(t => { colMap[t.college] = (colMap[t.college] || 0) + 1 })
    const collegeData = Object.entries(colMap)
      .map(([college, count]) => ({ college, name: COLLEGE_SHORT[college] || college, count, color: COLLEGE_COLORS[college] || '#888' }))
      .sort((a, b) => b.count - a.count)

    // Top keywords
    const kwMap = {}
    theses.forEach(t => {
      ;(t.keywords || []).forEach(kw => {
        if (!kw || kw.length < 3 || kw.length > 60) return
        const k = kw.toLowerCase().trim()
        kwMap[k] = (kwMap[k] || 0) + 1
      })
    })
    const keywordData = Object.entries(kwMap)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    // Heatmap grid
    const colleges = Object.keys(COLLEGE_COLORS)
    const grid = {}
    colleges.forEach(col => {
      grid[col] = {}
      HEAT_YEARS.forEach(y => { grid[col][y] = 0 })
    })
    const heatMin = HEAT_YEARS[0]
    const heatMax = HEAT_YEARS[HEAT_YEARS.length - 1]
    theses.forEach(t => {
      if (grid[t.college] && t.year >= heatMin && t.year <= heatMax) {
        grid[t.college][t.year]++
      }
    })
    const maxHeat = Math.max(...Object.values(grid).flatMap(y => Object.values(y)), 1)

    const validYears = theses.map(t => t.year).filter(y => y >= 2000)

    return {
      yearData,
      collegeData,
      keywordData,
      heatGrid: { grid, maxHeat, colleges },
      stats: {
        total: theses.length,
        minYear: validYears.reduce((a, b) => Math.min(a, b), Infinity),
        maxYear: validYears.reduce((a, b) => Math.max(a, b), -Infinity),
        collegesCount: collegeData.length,
        avgPerYear: yearData.length ? Math.round(theses.length / yearData.length) : 0,
      },
    }
  }, [theses])

  return (
    <>
      <Helmet>
        <title>Research Trends — AnimoSearch</title>
        <meta name="description" content="Visualize DLSU research output: publications by year, college distributions, top keywords, and activity heatmaps." />
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Data Visualization</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Research Trends
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Explore DLSU's research landscape through data: publication patterns, college activity, and the keywords that define each decade.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        {isLoading ? (
          <div className="container-lg py-24 flex justify-center">
            <div className="w-8 h-8 border-2 border-[var(--color-border-light)] border-t-[var(--color-primary)] rounded-full animate-spin" aria-hidden="true" />
          </div>
        ) : (
          <div className="container-lg py-12 space-y-16">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard label="Total Theses" value={stats.total?.toLocaleString()} Icon={BookOpen} />
              <StatCard label="Year Range" value={`${stats.minYear}–${stats.maxYear}`} Icon={TrendingUp} />
              <StatCard label="Colleges" value={stats.collegesCount} Icon={Building2} />
              <StatCard label="Avg / Year" value={stats.avgPerYear} Icon={Hash} />
            </div>

            {/* Publications by Year */}
            <section>
              <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-1">Publications by Year</h2>
              <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 mb-6">Thesis output from 2000 to present, split by degree level.</p>
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={yearData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gGraduate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#005E3A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#005E3A" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gDoctoral" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#FFB81C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FFB81C" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="gUndergrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#E63946" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#E63946" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: 'Outfit, sans-serif' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fontFamily: 'Outfit, sans-serif' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<YearTooltip />} />
                    <Legend
                      wrapperStyle={{
                        fontSize: '11px',
                        fontFamily: 'Josefin Sans, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        paddingTop: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="graduate"     name="Master's"     stroke="#005E3A" strokeWidth={2} fill="url(#gGraduate)" />
                    <Area type="monotone" dataKey="doctoral"     name="Doctoral"     stroke="#FFB81C" strokeWidth={2} fill="url(#gDoctoral)" />
                    <Area type="monotone" dataKey="undergraduate" name="Undergraduate" stroke="#E63946" strokeWidth={2} fill="url(#gUndergrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* College + Keywords */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* By College */}
              <section>
                <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-1">By College</h2>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 mb-6">Total thesis output per college.</p>
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-6">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={collegeData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'Outfit, sans-serif' }} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: 'Josefin Sans, sans-serif' }} tickLine={false} axisLine={false} width={90} />
                      <Tooltip content={<CollegeTooltip />} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {collegeData.map(entry => (
                          <Cell key={entry.college} fill={entry.color} fillOpacity={0.85} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Top Keywords */}
              <section>
                <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-1">Top Keywords</h2>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 mb-6">Click any keyword to browse related theses.</p>
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-6">
                  <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                    {keywordData.map(kw => {
                      const pct = Math.round((kw.count / (keywordData[0]?.count || 1)) * 100)
                      return (
                        <button
                          key={kw.keyword}
                          onClick={() => navigate(`/theses?q=${encodeURIComponent(kw.keyword)}`)}
                          className="w-full text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded"
                          aria-label={`Browse ${kw.count} theses about ${kw.keyword}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-label text-xs text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors capitalize">{kw.keyword}</span>
                            <span className="font-mono text-xs text-[var(--color-ink-muted)] dark:text-white/40 ml-2 shrink-0">{kw.count}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--color-border-light)] dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[var(--color-primary)] group-hover:opacity-75 transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </section>
            </div>

            {/* Heatmap */}
            {heatGrid && (
              <section>
                <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-1">Research Activity Heatmap</h2>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 mb-6">Thesis output per college, 2010–2024. Darker cells = higher output.</p>
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 p-6 overflow-x-auto">
                  <table className="w-full" style={{ minWidth: '560px' }}>
                    <thead>
                      <tr>
                        <th className="font-label text-left text-xs text-[var(--color-ink-subtle)] dark:text-white/40 pr-4 pb-2 w-20">College</th>
                        {HEAT_YEARS.map(y => (
                          <th key={y} className="font-label text-center text-[9px] text-[var(--color-ink-subtle)] dark:text-white/40 pb-2 w-8">{y}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {heatGrid.colleges.map(col => (
                        <tr key={col}>
                          <td className="font-label text-xs font-semibold text-[var(--color-ink)] dark:text-white pr-4 py-1">{col}</td>
                          {HEAT_YEARS.map(y => {
                            const count = heatGrid.grid[col]?.[y] || 0
                            const intensity = count / heatGrid.maxHeat
                            const baseColor = COLLEGE_COLORS[col] || '#005E3A'
                            return (
                              <td key={y} className="py-0.5 px-0.5">
                                <div
                                  className="rounded mx-auto flex items-center justify-center transition-transform hover:scale-110 cursor-default"
                                  style={{
                                    width: 26,
                                    height: 20,
                                    background: count > 0 ? baseColor : 'transparent',
                                    opacity: count > 0 ? 0.12 + intensity * 0.88 : 1,
                                    border: count === 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                    fontSize: '9px',
                                    fontFamily: 'monospace',
                                    color: intensity > 0.55 ? '#fff' : 'transparent',
                                  }}
                                  title={`${col} ${y}: ${count} thesis${count !== 1 ? 'es' : ''}`}
                                >
                                  {count > 0 ? count : ''}
                                </div>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </>
  )
}

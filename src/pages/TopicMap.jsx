import { useEffect, useRef, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import * as d3 from 'd3'
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

const ALL_COLLEGES = ['All', ...Object.keys(COLLEGE_COLORS)]

export default function TopicMap() {
  const navigate = useNavigate()
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [activeCollege, setActiveCollege] = useState('All')
  const [dimensions, setDimensions] = useState({ width: 800, height: 560 })

  const { data: theses = [], isLoading } = useQuery({
    queryKey: ['theses'],
    queryFn: fetchAllTheses,
  })

  // Build keyword node data
  const nodes = useMemo(() => {
    if (!theses.length) return []
    const kwMap = {}
    theses.forEach(t => {
      ;(t.keywords || []).forEach(kw => {
        if (!kw || kw.length < 3 || kw.length > 60) return
        const k = kw.toLowerCase().trim()
        if (!kwMap[k]) kwMap[k] = { keyword: k, count: 0, collegeCounts: {} }
        kwMap[k].count++
        kwMap[k].collegeCounts[t.college] = (kwMap[k].collegeCounts[t.college] || 0) + 1
      })
    })
    return Object.values(kwMap)
      .filter(n => n.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 120)
      .map(n => {
        const topCollege = Object.entries(n.collegeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'CCS'
        return { ...n, topCollege }
      })
  }, [theses])

  const filteredNodes = useMemo(() => {
    if (activeCollege === 'All') return nodes
    return nodes.filter(n => n.topCollege === activeCollege)
  }, [nodes, activeCollege])

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect
      if (width > 0) {
        setDimensions({ width, height: Math.max(Math.min(width * 0.65, 600), 380) })
      }
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // D3 pack layout — deterministic, fills the canvas reliably
  useEffect(() => {
    if (!svgRef.current || !filteredNodes.length) return

    const { width, height } = dimensions

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    // Build hierarchy for d3.pack
    const root = d3.hierarchy({ children: filteredNodes })
      .sum(d => d.count || 0)
      .sort((a, b) => b.value - a.value)

    d3.pack()
      .size([width - 4, height - 4])
      .padding(3)(root)

    const g = svg.append('g').attr('transform', 'translate(2,2)')

    const node = g.selectAll('g.node')
      .data(root.leaves())
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        navigate(`/theses?q=${encodeURIComponent(d.data.keyword)}`)
      })
      .on('mouseenter', (event, d) => {
        const svgRect = svgRef.current.getBoundingClientRect()
        setTooltip({
          keyword: d.data.keyword,
          count: d.data.count,
          college: d.data.topCollege,
          x: event.clientX - svgRect.left,
          y: event.clientY - svgRect.top,
        })
        d3.select(event.currentTarget).select('circle')
          .transition().duration(120)
          .attr('r', d.r * 1.08)
      })
      .on('mouseleave', (event, d) => {
        setTooltip(null)
        d3.select(event.currentTarget).select('circle')
          .transition().duration(120)
          .attr('r', d.r)
      })

    node.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => COLLEGE_COLORS[d.data.topCollege] || '#005E3A')
      .attr('fill-opacity', 0.78)
      .attr('stroke', d => COLLEGE_COLORS[d.data.topCollege] || '#005E3A')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.9)

    node.append('text')
      .text(d => {
        const maxLen = Math.floor(d.r * 0.36)
        return d.data.keyword.length > maxLen
          ? d.data.keyword.slice(0, maxLen) + '…'
          : d.data.keyword
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#fff')
      .attr('fill-opacity', d => d.r > 18 ? 0.92 : 0)
      .style('font-size', d => Math.max(9, Math.min(d.r * 0.28, 13)) + 'px')
      .style('font-family', 'Josefin Sans, sans-serif')
      .style('font-weight', '600')
      .style('letter-spacing', '0.02em')
      .style('pointer-events', 'none')
      .style('user-select', 'none')
  }, [filteredNodes, dimensions, navigate])

  return (
    <>
      <Helmet>
        <title>Topic Map — AnimoSearch</title>
        <meta name="description" content="Interactive visualization of DLSU research topics. Explore keywords by size and college. Click any bubble to browse related theses." />
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Interactive Visualization</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Topic Map
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Each bubble is a research keyword. Size reflects frequency. Color shows the dominant college. Click any bubble to explore related theses.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">

          {/* College filter */}
          <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by college">
            {ALL_COLLEGES.map(col => (
              <button
                key={col}
                onClick={() => setActiveCollege(col)}
                className={`px-4 py-2 rounded-full font-label text-xs transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                  activeCollege === col
                    ? 'text-white border-transparent'
                    : 'bg-white dark:bg-[var(--color-card-dark)] text-[var(--color-ink-muted)] dark:text-white/60 border-[var(--color-border-light)] dark:border-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
                style={
                  activeCollege === col
                    ? { backgroundColor: col === 'All' ? 'var(--color-primary)' : COLLEGE_COLORS[col] }
                    : {}
                }
              >
                {col}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6">
            {Object.entries(COLLEGE_COLORS).map(([col, color]) => (
              <div key={col} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} aria-hidden="true" />
                <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50">{col}</span>
              </div>
            ))}
          </div>

          {/* Visualization */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-[var(--color-border-light)] border-t-[var(--color-primary)] rounded-full animate-spin" aria-hidden="true" />
              <span role="status" className="sr-only">Loading topic map…</span>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="relative bg-white dark:bg-[var(--color-card-dark)] rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 overflow-hidden"
            >
              <svg
                ref={svgRef}
                width="100%"
                height={dimensions.height}
                role="img"
                aria-label={activeCollege === 'All' ? 'Topic map visualization — all colleges' : `Topic map visualization — ${activeCollege}`}
              />

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="absolute z-10 pointer-events-none bg-[var(--color-ink)] text-white rounded-xl px-4 py-3 shadow-2xl text-sm"
                  style={{
                    left: Math.min(tooltip.x + 14, dimensions.width - 190),
                    top: Math.max(tooltip.y - 56, 8),
                  }}
                >
                  <p className="font-semibold capitalize mb-1">{tooltip.keyword}</p>
                  <p className="font-mono text-white/60 text-xs">{tooltip.count} theses</p>
                  <p className="font-label text-xs text-white/50 mt-0.5">{tooltip.college}</p>
                </div>
              )}

              {filteredNodes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-label text-sm text-[var(--color-ink-muted)] dark:text-white/40">No keyword data for this college</p>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-[var(--color-ink-subtle)] dark:text-white/30 mt-4 font-label text-center">
            Showing top {filteredNodes.length} keywords by frequency. Click a bubble to browse theses.
          </p>
        </div>
      </div>
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Search, BookOpen, Users, Award, ArrowRight,
  Brain, FlaskConical, Building2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllTheses } from '../lib/thesesApi'
import { colleges } from '../data/colleges'

/* ── Animated Counter ──────────────────────────────────── */
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const animate = (now) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
            else setCount(target)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

/* ── Thesis Card ───────────────────────────────────────── */
function ThesisCard({ thesis }) {
  const degreeLabel = thesis.degreeLevel === 'undergraduate' ? 'Undergrad'
    : thesis.degreeLevel === 'graduate' ? 'Masteral'
    : 'Doctoral'

  return (
    <Link
      to={`/theses/${thesis.slug}`}
      className="group flex-shrink-0 w-72 md:w-80 h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-card-dark)] shadow-[0_4px_20px_rgba(0,94,58,0.1)] hover:shadow-[0_8px_32px_rgba(0,94,58,0.2)] transition-all duration-300 hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      aria-label={`Read thesis: ${thesis.title}`}
    >
      {/* Color header band by college */}
      <div
        className="h-2 w-full flex-shrink-0"
        style={{ background: colleges.find(c => c.id === thesis.college.toLowerCase())?.color || 'var(--color-primary)' }}
        aria-hidden="true"
      />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="tag tag-blue">{thesis.college}</span>
          <span className="tag tag-orange">{degreeLabel}</span>
        </div>
        <h3 className="font-display font-bold text-base text-[var(--color-ink)] dark:text-white mb-2 leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-3">
          {thesis.title}
        </h3>
        <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-3">
          {thesis.author} · {thesis.year}
        </p>
        <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed line-clamp-3 flex-1">
          {thesis.abstract}
        </p>
        <div className="flex flex-wrap gap-1 mt-3">
          {thesis.keywords.slice(0, 3).map(kw => (
            <span key={kw} className="tag tag-teal text-[0.6rem]">{kw}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

/* ── Featured Carousel ─────────────────────────────────── */
function FeaturedCarousel({ featured }) {
  const containerRef = useRef(null)
  const pausedRef = useRef(false)
  const posRef = useRef(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!featured.length) return
    const el = containerRef.current
    if (!el) return
    const SPEED = 0.5
    let raf
    const tick = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED
        const half = el.scrollWidth / 2
        if (posRef.current >= half) posRef.current -= half
        el.scrollLeft = posRef.current
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [featured.length])

  const handleMouseEnter = () => { pausedRef.current = true; setPaused(true) }
  const handleMouseLeave = () => {
    if (containerRef.current) posRef.current = containerRef.current.scrollLeft
    pausedRef.current = false
    setPaused(false)
  }

  if (!featured.length) return null
  const doubled = [...featured, ...featured]

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        ref={containerRef}
        className="overflow-x-auto pb-3"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-primary) transparent' }}
        role="list"
        aria-label="Featured theses carousel"
      >
        <div className="flex w-max">
          {doubled.map((thesis, i) => (
            <div
              key={`${thesis.id}-${i}`}
              className="h-[380px] flex-shrink-0 w-72 md:w-80 mr-5"
              role="listitem"
              aria-hidden={i >= featured.length ? true : undefined}
            >
              <ThesisCard thesis={thesis} />
            </div>
          ))}
        </div>
      </div>

      <div className="container-lg mt-2 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${paused ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border-light)] dark:bg-white/20'}`}
          aria-hidden="true"
        />
        <span className="font-label text-[0.6rem] tracking-[0.1em] text-[var(--color-ink-subtle)] dark:text-white/30 select-none">
          {paused ? 'PAUSED — move away to resume' : 'LIVE — hover to pause'}
        </span>
      </div>
    </div>
  )
}

/* ── Main Home Component ───────────────────────────────── */
export default function Home() {
  const { data: allTheses = [] } = useQuery({ queryKey: ['theses'], queryFn: fetchAllTheses })
  const featured = allTheses.filter(t => t.featured).slice(0, 6)
  const topColleges = colleges

  const stats = [
    { value: 20000, label: 'Theses & Dissertations', suffix: '+' },
    { value: 8, label: 'Colleges', suffix: '' },
    { value: 50, label: 'Degree Programs', suffix: '+' },
    { value: 2200, label: 'New Submissions/Year', suffix: '+' },
  ]

  const reasons = [
    {
      icon: Search,
      title: 'Smart Discovery',
      desc: 'Search and filter 20,000+ DLSU theses by keyword, college, degree level, and year. Find relevant prior work in seconds.',
    },
    {
      icon: Brain,
      title: 'Real Research Data',
      desc: 'All records sourced directly from the Animo Repository via OAI-PMH. Abstracts, keywords, authors, and degree details from the source.',
    },
    {
      icon: Award,
      title: 'Planning Tools',
      desc: 'Milestone planner, requirements checklist, budget estimator, and writing guide — everything you need from proposal to submission.',
    },
    {
      icon: Users,
      title: 'Built for Lasallians',
      desc: 'Designed specifically for DLSU students navigating the thesis process. Organized by the colleges and programs you know.',
    },
  ]

  const testimonials = [
    {
      quote: "I spent two weeks searching Animo Repository manually. AnimoSearch helped me find five highly relevant theses in my topic area in under 10 minutes. This is genuinely useful.",
      author: 'Mark Ramos',
      role: 'CCS Graduate Student, Computer Science',
      avatar: 'M',
    },
    {
      quote: "The requirements checklist saved me from missing a critical submission deadline. I had no idea about the Turnitin similarity requirement until I saw it in the list.",
      author: 'Sofia Dela Cruz',
      role: 'COE Senior, Civil Engineering',
      avatar: 'S',
    },
    {
      quote: "Reading abstracts of past COB theses on similar topics helped me refine my own research question. I can see what approaches have already been tried and what angles are still open.",
      author: 'James Uy',
      role: 'COB Masteral Student, Finance',
      avatar: 'J',
    },
  ]

  return (
    <>
      <Helmet>
        <title>AnimoSearch — DLSU Thesis & Research Finder</title>
        <meta name="description" content="Discover DLSU research. Browse, search, and explore 20,000+ theses and dissertations from De La Salle University's Animo Repository." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero: Welcome to AnimoSearch"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1280&q=75&auto=format"
            alt="De La Salle University campus building"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="hero-overlay" />
          <div
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
              backgroundSize: '128px 128px',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Hero content */}
        <div className="relative container-lg flex flex-col items-center text-center text-white pt-20 pb-32">
          <span
            className="font-label text-xs tracking-[0.2em] text-[var(--color-secondary-light)] mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            De La Salle University Research Discovery
          </span>

          <h1
            className="font-display font-bold text-white opacity-0 animate-fade-in-up mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              lineHeight: 1.05,
              animationDelay: '0.25s',
              animationFillMode: 'forwards',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            Discover DLSU Research.<br />
            <em className="not-italic" style={{ color: 'var(--color-secondary-light)' }}>Start Your Own.</em>
          </h1>

          <p
            className="text-white/80 max-w-xl mb-10 leading-relaxed opacity-0 animate-fade-in-up"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              animationDelay: '0.45s',
              animationFillMode: 'forwards',
            }}
          >
            Search 20,000+ theses and dissertations from the Animo Repository.
            Find prior work, discover research gaps, and plan your own thesis with purpose.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <Link to="/theses" className="btn-primary">
              <Search size={16} aria-hidden="true" />
              Browse Theses
            </Link>
            <Link to="/guide" className="btn-secondary">
              Writing Guide
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-70" aria-hidden="true">
          <span className="font-label text-[0.6rem] tracking-[0.2em] text-white">SCROLL</span>
          <div className="scroll-indicator" />
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ height: '60px', width: '100%' }}>
            <path d="M0 80V40C360 0 720 80 1080 40C1260 20 1350 60 1440 40V80H0Z"
              fill="var(--color-sky-bg)" className="dark:fill-[#0D1F14]" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section
        className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] py-14"
        aria-label="Animo Repository by the numbers"
      >
        <div className="container-lg">
          <p className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40 text-center mb-8" data-aos="fade-up">
            Animo Repository — By the Numbers
          </p>
          <div className="flex flex-col sm:flex-row items-stretch divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border-light)] dark:divide-white/10 border border-[var(--color-border-light)] dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-card-dark)]" data-aos="fade-up">
            {stats.map(({ value, label, suffix }, i) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center justify-center py-8 px-6 relative"
              >
                {i === 0 && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" aria-hidden="true" />
                )}
                <div
                  className="font-display font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] leading-none mb-2"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="font-label text-[0.65rem] text-[var(--color-ink-muted)] dark:text-white/50 text-center">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ANIMOSEARCH ───────────────────────────────── */}
      <section
        className="section bg-white dark:bg-[#111820]"
        aria-labelledby="why-heading"
      >
        <div className="container-lg">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="section-label">Why AnimoSearch</span>
            <h2
              className="font-display font-bold text-[var(--color-ink)] dark:text-white"
              id="why-heading"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              Research Starts Here
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="flex flex-col items-start"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-sky-bg)] dark:bg-[var(--color-primary)]/20 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[var(--color-primary)]" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-lg text-[var(--color-ink)] dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED THESES ───────────────────────────────── */}
      <section
        className="section bg-[var(--color-sky-bg)] dark:bg-[#0D1F14]"
        aria-labelledby="featured-heading"
      >
        <div className="container-lg">
          <div className="flex items-end justify-between mb-10" data-aos="fade-up">
            <div>
              <span className="section-label">Recent & Notable</span>
              <h2
                className="font-display font-bold text-[var(--color-ink)] dark:text-white"
                id="featured-heading"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
              >
                Featured Theses
              </h2>
            </div>
            <Link
              to="/theses"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}
            >
              View All <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <FeaturedCarousel featured={featured} />

        <div className="text-center mt-8 md:hidden container-lg">
          <Link to="/theses" className="btn-outline">
            View All Theses <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── COLLEGES ──────────────────────────────────────── */}
      <section
        className="section bg-white dark:bg-[#111820]"
        aria-labelledby="colleges-heading"
      >
        <div className="container-lg">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="section-label">Browse by College</span>
            <h2
              className="font-display font-bold text-[var(--color-ink)] dark:text-white"
              id="colleges-heading"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              8 Colleges. One Repository.
            </h2>
            <p className="mt-3 text-[var(--color-ink-muted)] dark:text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
              Explore research by college and drill down to specific departments. Each college has its own research thrust areas and thesis conventions.
            </p>
          </div>

          <div className="border border-[var(--color-border-light)] dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-card-dark)]">
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {topColleges.map((college, i) => (
                <Link
                  key={college.id}
                  to="/colleges"
                  className={`group flex items-stretch min-h-[80px] hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] border-[var(--color-border-light)] dark:border-white/10 ${i < topColleges.length - 2 ? 'border-b' : ''} ${i % 2 === 0 ? 'sm:border-r' : ''}`}
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                  aria-label={`Explore ${college.abbreviation} — ${college.name}`}
                >
                  {/* Thick color stripe */}
                  <div className="w-1.5 flex-shrink-0" style={{ background: college.color }} aria-hidden="true" />

                  <div className="flex items-center gap-4 px-5 py-4 flex-1">
                    {/* Abbreviation */}
                    <span
                      className="font-display font-bold text-xl flex-shrink-0 transition-colors duration-200"
                      style={{ color: college.color }}
                    >
                      {college.abbreviation}
                    </span>

                    {/* Name */}
                    <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 leading-snug flex-1 min-w-0">
                      {college.name}
                    </p>

                    {/* Count */}
                    <div className="flex-shrink-0 text-right">
                      <p className="font-label text-xs font-bold text-[var(--color-ink)] dark:text-white">
                        {college.thesisCount.toLocaleString()}
                      </p>
                      <p className="font-label text-[10px] text-[var(--color-ink-subtle)] dark:text-white/30 tracking-wide">
                        THESES
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center mt-8" data-aos="fade-up">
            <Link to="/colleges" className="btn-outline">
              <Building2 size={14} aria-hidden="true" /> Explore All Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section
        className="section relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #003D25 100%)' }}
        aria-labelledby="testimonials-heading"
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'var(--color-secondary)', transform: 'translate(30%, -30%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'var(--color-accent)', transform: 'translate(-30%, 30%)' }} aria-hidden="true" />

        <div className="relative container-lg">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-2">Student Voices</span>
            <h2
              className="font-display font-bold text-white"
              id="testimonials-heading"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              From Lasallian Researchers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, author, role, avatar }, i) => (
              <figure
                key={author}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
                data-aos="fade-up"
                data-aos-delay={i * 120}
              >
                <blockquote>
                  <p className="text-white/90 text-sm leading-relaxed italic mb-6">
                    &ldquo;{quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                    aria-hidden="true"
                  >
                    {avatar}
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-white text-sm block">{author}</cite>
                    <span className="text-white/60 text-xs">{role}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section
        className="section bg-[var(--color-sky-bg)] dark:bg-[#0D1F14]"
        aria-labelledby="cta-heading"
      >
        <div className="container-lg">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, var(--color-ink) 0%, #0A2516 100%)' }}
            data-aos="fade-up"
          >
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 hidden lg:block" aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=70&auto=format"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--color-ink), transparent)' }} />
            </div>

            <div className="relative p-10 md:p-16 max-w-lg">
              <span className="section-label" style={{ color: 'var(--color-secondary-light)' }}>Start Your Research Journey</span>
              <h2
                className="font-display font-bold text-white mb-4"
                id="cta-heading"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
              >
                20,000+ Theses Waiting to Inform Your Research
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                Every great thesis builds on what came before. Browse the Animo Repository, find your research gap, and use our tools to plan your journey from proposal to defense.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/theses" className="btn-primary">
                  <Search size={16} aria-hidden="true" />
                  Browse All Theses
                </Link>
                <Link to="/quiz" className="btn-secondary">
                  Take the Research Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

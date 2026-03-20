import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Waves, Mountain, Camera, Utensils, Star, ArrowRight,
  ChevronDown, Globe, Users, MapPin, Compass, Shield, Clock
} from 'lucide-react'
import { getFeaturedDestinations } from '../data/destinations'
import { islandGroups } from '../data/regions'

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

/* ── Star Rating ───────────────────────────────────────── */
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          strokeWidth={0}
          fill={i <= Math.round(rating) ? '#F59E0B' : '#CBD5E0'}
          aria-hidden="true"
        />
      ))}
      <span className="text-xs text-[var(--color-ink-muted)] ml-1 font-medium">{rating}</span>
    </div>
  )
}

/* ── Destination Card ──────────────────────────────────── */
function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group flex-shrink-0 w-64 md:w-72 rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-card-dark)] shadow-[0_4px_20px_rgba(0,119,182,0.1)] hover:shadow-[0_8px_32px_rgba(0,119,182,0.2)] transition-all duration-300 hover:-translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      aria-label={`Explore ${destination.name}`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={destination.image_url}
          alt={`${destination.name}, ${destination.province}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="tag tag-blue bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {destination.island_group}
          </span>
          <span className={`tag text-white font-semibold backdrop-blur-sm border border-white/30 ${
            destination.budget_level === 'Budget' ? 'bg-green-500/70' :
            destination.budget_level === 'Mid-range' ? 'bg-[var(--color-secondary)]/70' :
            'bg-purple-500/70'
          }`}>
            {destination.budget_level}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {destination.name}
        </h3>
        <p className="flex items-center gap-1 text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-2">
          <MapPin size={11} aria-hidden="true" />
          {destination.province}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {destination.activities.slice(0, 2).map(act => (
            <span key={act} className="tag tag-teal text-[0.6rem]">{act}</span>
          ))}
        </div>
        <StarRating rating={destination.rating} />
      </div>
    </Link>
  )
}

/* ── Main Home Component ───────────────────────────────── */
export default function Home() {
  const featured = getFeaturedDestinations(6)

  const stats = [
    { value: 7641, label: 'Islands', suffix: '' },
    { value: 81, label: 'Provinces', suffix: '' },
    { value: 17, label: 'Regions', suffix: '' },
    { value: 500, label: 'Species of Birds', suffix: '+' },
  ]

  const reasons = [
    {
      icon: Waves,
      title: 'World-Class Beaches',
      desc: 'From Boracay\'s powdery white sand to El Nido\'s turquoise lagoons — consistently ranked among the world\'s best.',
    },
    {
      icon: Mountain,
      title: 'Dramatic Landscapes',
      desc: 'Volcano peaks, rice terrace amphitheaters, underground rivers, and highland pine forests that feel worlds apart.',
    },
    {
      icon: Utensils,
      title: 'Rich Food Culture',
      desc: 'Lechon, adobo, sinigang, kare-kare — Filipino cuisine is a beautiful fusion of Malay, Spanish, Chinese, and American influences.',
    },
    {
      icon: Users,
      title: 'Warmest People',
      desc: 'The Philippines consistently ranks as one of the friendliest nations on earth. Hospitality here is not a policy — it\'s a way of life.',
    },
  ]

  const testimonials = [
    {
      quote: "Walking through Vigan's cobblestone streets at night, with the gas lanterns lit — it felt like stepping into another century. The Philippines surprised me at every turn.",
      author: 'Maria Santos',
      role: 'Travel Photographer, Manila',
      avatar: 'M',
    },
    {
      quote: "The first time I dove at Apo Island and a sea turtle swam right past me — that image will stay with me forever. This country's underwater world is simply unreal.",
      author: 'James Wilson',
      role: 'Dive Instructor, Cebu',
      avatar: 'J',
    },
    {
      quote: "I planned a 2-week trip and ended up staying for 6. There's something about the Philippines that makes leaving feel impossible. I keep coming back.",
      author: 'Yuki Tanaka',
      role: 'Freelance Writer, Tokyo',
      avatar: 'Y',
    },
  ]

  return (
    <>
      <Helmet>
        <title>Lakbay PH — Your Journey Starts Here</title>
        <meta name="description" content="Discover the best travel destinations in the Philippines. Explore 7,641 islands of beaches, mountains, heritage, and culture with Lakbay PH." />
      </Helmet>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        aria-label="Hero: Welcome to Lakbay PH"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573790387438-4da905039392?w=1600&q=85"
            alt="El Nido, Palawan — dramatic limestone cliffs and turquoise water"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="hero-overlay" />
          {/* Subtle grain overlay */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
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
            Discover the Philippines
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
            Your Journey<br />
            <em className="not-italic" style={{ color: 'var(--color-secondary-light)' }}>Starts Here</em>
          </h1>

          <p
            className="text-white/80 max-w-xl mb-10 leading-relaxed opacity-0 animate-fade-in-up"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.125rem)',
              animationDelay: '0.45s',
              animationFillMode: 'forwards',
            }}
          >
            7,641 islands. Endless discoveries. From world-class beaches to ancient rice terraces,
            from colonial cities to volcanic peaks — explore the Philippines with confidence.
          </p>

          <div
            className="flex flex-wrap items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
          >
            <Link to="/destinations" className="btn-primary">
              <Compass size={16} aria-hidden="true" />
              Explore Destinations
            </Link>
            <Link to="/itinerary" className="btn-secondary">
              Plan My Trip
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
              fill="var(--color-sky-bg)" className="dark:fill-[#0F1923]" />
          </svg>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section
        className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] py-16"
        aria-label="Philippines by the numbers"
      >
        <div className="container-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, suffix }) => (
              <div
                key={label}
                className="text-center"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div
                  className="font-display font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mb-1"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
                >
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <div className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY VISIT ─────────────────────────────────────── */}
      <section
        className="section bg-white dark:bg-[#111820]"
        aria-labelledby="why-visit-heading"
      >
        <div className="container-lg">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="section-label">Why the Philippines</span>
            <h2
              className="font-display font-bold text-[var(--color-ink)] dark:text-white"
              id="why-visit-heading"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              A Country That Changes You
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

      {/* ── FEATURED DESTINATIONS ─────────────────────────── */}
      <section
        className="section bg-[var(--color-sky-bg)] dark:bg-[#0F1923]"
        aria-labelledby="featured-heading"
      >
        <div className="container-lg">
          <div className="flex items-end justify-between mb-10" data-aos="fade-up">
            <div>
              <span className="section-label">Top Rated</span>
              <h2
                className="font-display font-bold text-[var(--color-ink)] dark:text-white"
                id="featured-heading"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
              >
                Featured Destinations
              </h2>
            </div>
            <Link
              to="/destinations"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem' }}
            >
              View All <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 px-6"
          style={{
            scrollbarWidth: 'thin',
            scrollSnapType: 'x mandatory',
            paddingLeft: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
            paddingRight: 'max(1.5rem, calc((100vw - 1280px) / 2 + 1.5rem))',
          }}
          role="list"
          aria-label="Featured destinations"
        >
          {featured.map(dest => (
            <div
              key={dest.id}
              style={{ scrollSnapAlign: 'start' }}
              role="listitem"
              data-aos="fade-up"
            >
              <DestinationCard destination={dest} />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/destinations" className="btn-outline">
            View All Destinations <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── ISLAND GROUPS ─────────────────────────────────── */}
      <section
        className="section bg-white dark:bg-[#111820]"
        aria-labelledby="islands-heading"
      >
        <div className="container-lg">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="section-label">Explore by Region</span>
            <h2
              className="font-display font-bold text-[var(--color-ink)] dark:text-white"
              id="islands-heading"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              Three Island Groups
            </h2>
            <p className="mt-3 text-[var(--color-ink-muted)] dark:text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
              Luzon, Visayas, and Mindanao — each with a distinct character, landscape, and culture worth exploring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {islandGroups.map((group, i) => (
              <Link
                key={group.id}
                to={`/regions?group=${group.id}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-4"
                data-aos="fade-up"
                data-aos-delay={i * 150}
                aria-label={`Explore ${group.name}`}
              >
                <img
                  src={group.image_url}
                  alt={`${group.name} — ${group.tagline}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923]/80 via-[#0F1923]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-3 h-3 rounded-full mb-3" style={{ background: group.color }} aria-hidden="true" />
                  <h3 className="font-display font-bold text-white text-2xl mb-1">{group.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{group.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-accent)] group-hover:gap-2 transition-all"
                    style={{ fontFamily: 'var(--font-label)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Explore <ArrowRight size={12} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section
        className="section relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #004E7C 100%)' }}
        aria-labelledby="testimonials-heading"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'var(--color-accent)', transform: 'translate(30%, -30%)' }} aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'var(--color-secondary)', transform: 'translate(-30%, 30%)' }} aria-hidden="true" />

        <div className="relative container-lg">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-2">Traveler Stories</span>
            <h2
              className="font-display font-bold text-white"
              id="testimonials-heading"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
            >
              Voices from the Islands
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
        className="section bg-[var(--color-sky-bg)] dark:bg-[#0F1923]"
        aria-labelledby="cta-heading"
      >
        <div className="container-lg">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, var(--color-ink) 0%, #1a3a5c 100%)' }}
            data-aos="fade-up"
          >
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 hidden lg:block" aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=70"
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--color-ink), transparent)' }} />
            </div>

            <div className="relative p-10 md:p-16 max-w-lg">
              <span className="section-label" style={{ color: 'var(--color-secondary-light)' }}>Ready to Explore?</span>
              <h2
                className="font-display font-bold text-white mb-4"
                id="cta-heading"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}
              >
                Discover 20+ Destinations Waiting for You
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                From beach paradises to mountain retreats, UNESCO heritage cities to world-class dive spots — your perfect Philippine adventure is just a click away.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/destinations" className="btn-primary">
                  <Globe size={16} aria-hidden="true" />
                  Browse All Destinations
                </Link>
                <Link to="/quiz" className="btn-secondary">
                  Take the PH Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

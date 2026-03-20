import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MapPin, Clock, Wallet, Navigation, Share2, ArrowLeft, Star, Check } from 'lucide-react'
import { useState } from 'react'
import { getDestinationBySlug, getRelatedDestinations } from '../data/destinations'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} strokeWidth={0} fill={i <= Math.round(rating) ? '#F59E0B' : '#CBD5E0'} aria-hidden="true" />
      ))}
      <span className="text-sm font-medium text-[var(--color-ink-muted)] dark:text-white/60 ml-1">{rating}</span>
    </div>
  )
}

export default function DestinationDetail() {
  const { slug } = useParams()
  const dest = getDestinationBySlug(slug)
  const related = getRelatedDestinations(slug, 4)
  const [copied, setCopied] = useState(false)
  const [activePhoto, setActivePhoto] = useState(null)

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: dest?.name, text: `Check out ${dest?.name}!`, url: window.location.href }) } catch {}
    } else {
      try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
    }
  }

  if (!dest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 gap-4">
        <h1 className="font-display text-3xl text-[var(--color-ink)] dark:text-white">Destination not found</h1>
        <Link to="/destinations" className="btn-primary">Back to Destinations</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{dest.name}, {dest.province} — Lakbay PH</title>
        <meta name="description" content={dest.description.slice(0, 155) + '…'} />
      </Helmet>

      <section className="relative h-[65vh] min-h-[440px] overflow-hidden">
        <img src={dest.image_url} alt={`${dest.name}, ${dest.province}`} className="w-full h-full object-cover" loading="eager" />
        <div className="hero-overlay" />
        <div className="absolute inset-0 flex items-end">
          <div className="container-lg pb-12">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-white/70 hover:text-white font-label text-xs tracking-wider uppercase mb-6 transition-colors cursor-pointer">
              <ArrowLeft size={14} aria-hidden="true" /> All Destinations
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tag bg-white/20 backdrop-blur-sm text-white border border-white/30">{dest.island_group}</span>
              {dest.activities.slice(0, 3).map(a => (
                <span key={a} className="tag bg-white/15 backdrop-blur-sm text-white border border-white/25">{a}</span>
              ))}
            </div>
            <h1 className="font-display font-bold text-white mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>{dest.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-white/70 text-sm"><MapPin size={14} aria-hidden="true" /> {dest.province}, {dest.region}</span>
              <StarRating rating={dest.rating} />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-white dark:bg-[#1E2A3A] border-b border-[var(--color-border-light)] dark:border-white/10">
        <div className="container-lg py-4 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-6">
            <span className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] dark:text-white/60">
              <Clock size={14} className="text-[var(--color-secondary)]" aria-hidden="true" /> {dest.best_time}
            </span>
            <span className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] dark:text-white/60">
              <Wallet size={14} className="text-[var(--color-accent)]" aria-hidden="true" /> {dest.budget_level}
            </span>
          </div>
          <button onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border-light)] dark:border-white/20 font-label text-xs text-[var(--color-primary)] hover:bg-[var(--color-sky-bg)] dark:hover:bg-white/5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
            <Share2 size={13} aria-hidden="true" /> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923]">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">About {dest.name}</h2>
                <p className="text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed text-[0.9375rem]">{dest.description}</p>
              </section>

              {(dest.gallery_urls?.length > 0) && (
                <section>
                  <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Photos</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {dest.gallery_urls.map((url, i) => (
                      <button key={i} onClick={() => setActivePhoto(url)}
                        className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                        aria-label={`View photo ${i + 1}`}>
                        <img src={url} alt={`${dest.name} photo ${i + 1}`} className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {dest.things_to_do?.length > 0 && (
                <section>
                  <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">Things to Do</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
                    {dest.things_to_do.map(item => (
                      <li key={item} className="flex items-start gap-3 bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-3.5 border border-[var(--color-border-light)] dark:border-white/10">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={11} className="text-[var(--color-accent-dark)]" aria-hidden="true" />
                        </div>
                        <span className="text-sm text-[var(--color-ink)] dark:text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-4">How to Get There</h2>
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-xl p-5 border border-[var(--color-border-light)] dark:border-white/10 flex gap-4">
                  <Navigation size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">{dest.how_to_get_there}</p>
                </div>
              </section>
            </div>

            <aside>
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 sticky top-24">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-5">Quick Info</h3>
                <dl className="space-y-4">
                  {[['Province', dest.province],['Island Group', dest.island_group],['Region', dest.region],['Best Time', dest.best_time],['Budget', dest.budget_level]].map(([label, value]) => (
                    <div key={label}>
                      <dt className="font-label text-xs text-[var(--color-ink-subtle)] dark:text-white/40 mb-0.5">{label}</dt>
                      <dd className="text-sm font-medium text-[var(--color-ink)] dark:text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 pt-4 border-t border-[var(--color-border-light)] dark:border-white/10">
                  <Link to="/itinerary" className="btn-primary w-full justify-center">Add to Itinerary</Link>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(d => (
                  <Link key={d.id} to={`/destinations/${d.slug}`} className="group card block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]">
                    <div className="relative h-36 overflow-hidden">
                      <img src={d.image_url} alt={d.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-3">
                      <p className="font-display font-semibold text-base text-[var(--color-ink)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors">{d.name}</p>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50">{d.province}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)} role="dialog" aria-modal="true" aria-label="Photo viewer">
          <button onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 cursor-pointer text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close photo viewer">✕</button>
          <img src={activePhoto} alt="Enlarged destination photo" className="max-w-full max-h-[90vh] rounded-xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}

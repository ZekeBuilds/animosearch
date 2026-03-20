import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const CATEGORIES = ['All', 'Nature', 'Culture', 'Beach', 'Adventure', 'Cities']

const photos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800&q=80', caption: 'El Nido Lagoons, Palawan', category: 'Nature' },
  { id: 2, url: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80', caption: 'Boracay White Beach', category: 'Beach' },
  { id: 3, url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800&q=80', caption: 'Siargao Surf Scene', category: 'Adventure' },
  { id: 4, url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', caption: 'Banaue Rice Terraces, Ifugao', category: 'Nature' },
  { id: 5, url: 'https://images.unsplash.com/photo-1524901548305-08eeddc35080?w=800&q=80', caption: 'Intramuros, Manila', category: 'Culture' },
  { id: 6, url: 'https://images.unsplash.com/photo-1580977251946-b1a7c4f8b0e8?w=800&q=80', caption: 'Chocolate Hills, Bohol', category: 'Nature' },
  { id: 7, url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', caption: 'Coral Triangle Diving', category: 'Adventure' },
  { id: 8, url: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800&q=80', caption: 'Mayon Volcano, Albay', category: 'Nature' },
  { id: 9, url: 'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=800&q=80', caption: 'Cebu City Skyline', category: 'Cities' },
  { id: 10, url: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&q=80', caption: 'Cordillera Mountains', category: 'Nature' },
  { id: 11, url: 'https://images.unsplash.com/photo-1597149308010-4e9f17eca9a8?w=800&q=80', caption: 'Vigan Heritage Street', category: 'Culture' },
  { id: 12, url: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80', caption: 'Siargao Island Hopping', category: 'Beach' },
  { id: 13, url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80', caption: 'Davao City, Mindanao', category: 'Cities' },
  { id: 14, url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=800&q=80', caption: 'Sunset in Siargao', category: 'Beach' },
  { id: 15, url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80', caption: 'Island Hopping Palawan', category: 'Adventure' },
  { id: 16, url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80', caption: 'Spanish Colonial Church', category: 'Culture' },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = activeCategory === 'All' ? photos : photos.filter(p => p.category === activeCategory)

  const openLightbox = (photo) => setLightbox(photo)
  const closeLightbox = () => setLightbox(null)

  const navigate = (dir) => {
    if (!lightbox) return
    const idx = filtered.findIndex(p => p.id === lightbox.id)
    const next = (idx + dir + filtered.length) % filtered.length
    setLightbox(filtered[next])
  }

  const handleKey = (e) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') navigate(-1)
    if (e.key === 'ArrowRight') navigate(1)
  }

  return (
    <>
      <Helmet>
        <title>Photo Gallery — Lakbay PH</title>
        <meta name="description" content="Stunning photography from across the Philippines — nature, beaches, culture, adventure, and cities." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Visual Stories</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Photo Gallery</h1>
          <p className="text-white/60 text-sm mb-8">
            {photos.length} photos from across the Philippine archipelago.
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full font-label text-xs transition-all cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                  ${activeCategory === cat
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white/10 text-white/70 border-white/20 hover:bg-white/20 hover:text-white'}`}
                aria-pressed={activeCategory === cat}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923]">
        <div className="container-lg py-10">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0">
            {filtered.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className="w-full mb-4 break-inside-avoid group relative rounded-xl overflow-hidden block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                data-aos="fade-up"
                data-aos-delay={Math.min(i * 50, 300)}
                aria-label={`View ${photo.caption}`}
              >
                <img src={photo.url} alt={photo.caption}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">{photo.caption}</p>
                    <span className="tag bg-white/20 text-white border border-white/30 mt-1">{photo.category}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-ink-subtle)] dark:text-white/30 text-center mt-8">
            Photos from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-primary)]">Unsplash</a>. Used for educational/demo purposes.
          </p>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKey}
          role="dialog" aria-modal="true" aria-label={`Photo viewer: ${lightbox.caption}`}
          tabIndex={-1}
        >
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close lightbox">
            <X size={18} aria-hidden="true" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigate(-1) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous photo">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); navigate(1) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next photo">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <div className="max-w-4xl max-h-[90vh] p-4 flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption}
              className="max-h-[80vh] max-w-full rounded-xl object-contain" />
            <p className="text-white/80 text-sm mt-3 text-center">{lightbox.caption}</p>
            <span className="tag bg-white/15 text-white border border-white/20 mt-2">{lightbox.category}</span>
          </div>
        </div>
      )}
    </>
  )
}

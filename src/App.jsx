import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Lazy load all pages for code-splitting
const Home = lazy(() => import('./pages/Home'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Regions = lazy(() => import('./pages/Regions'))
const TravelTips = lazy(() => import('./pages/TravelTips'))
const ItineraryBuilder = lazy(() => import('./pages/ItineraryBuilder'))
const PackingList = lazy(() => import('./pages/PackingList'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Quiz = lazy(() => import('./pages/Quiz'))
const BudgetEstimator = lazy(() => import('./pages/BudgetEstimator'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-sky-bg)] dark:bg-[#0F1923]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[var(--color-border-light)] border-t-[var(--color-primary)] rounded-full animate-spin" aria-hidden="true" />
        <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/40">Loading…</span>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-out-cubic',
      offset: 60,
    })
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:slug" element={<DestinationDetail />} />
              <Route path="/regions" element={<Regions />} />
              <Route path="/tips" element={<TravelTips />} />
              <Route path="/itinerary" element={<ItineraryBuilder />} />
              <Route path="/packing" element={<PackingList />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/budget" element={<BudgetEstimator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

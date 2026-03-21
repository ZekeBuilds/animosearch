import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, lazy, Suspense } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Lazy load all pages for code-splitting
const Home = lazy(() => import('./pages/Home'))
const Theses = lazy(() => import('./pages/Theses'))
const ThesisDetail = lazy(() => import('./pages/ThesisDetail'))
const Colleges = lazy(() => import('./pages/Colleges'))
const WritingGuide = lazy(() => import('./pages/WritingGuide'))
const ResearchPlanner = lazy(() => import('./pages/ResearchPlanner'))
const Checklist = lazy(() => import('./pages/Checklist'))
const Showcase = lazy(() => import('./pages/Showcase'))
const Quiz = lazy(() => import('./pages/Quiz'))
const ThesisBudget = lazy(() => import('./pages/ThesisBudget'))
const Submit = lazy(() => import('./pages/Submit'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-sky-bg)] dark:bg-[#0D1F14]">
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
              <Route path="/theses" element={<Theses />} />
              <Route path="/theses/:slug" element={<ThesisDetail />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/guide" element={<WritingGuide />} />
              <Route path="/planner" element={<ResearchPlanner />} />
              <Route path="/checklist" element={<Checklist />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/budget" element={<ThesisBudget />} />
              <Route path="/submit" element={<Submit />} />
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

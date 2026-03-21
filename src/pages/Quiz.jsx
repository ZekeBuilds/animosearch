import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight } from 'lucide-react'
import { quizQuestions } from '../data/quizQuestions'

const SCORE_TIERS = [
  { min: 9, label: 'Research Scholar', color: 'var(--color-secondary)', message: "Outstanding! You clearly know your DLSU research culture. Your thesis will be exceptional." },
  { min: 7, label: 'Graduate Researcher', color: 'var(--color-primary)', message: "Great score! You know DLSU and research methods well. Almost ready for that proposal defense." },
  { min: 5, label: 'Thesis Candidate', color: 'var(--color-accent)', message: "Good start! Dig into the Writing Guide and browse more theses on AnimoSearch to sharpen your knowledge." },
  { min: 0, label: 'First Year Student', color: '#9B59B6', message: "Every researcher starts somewhere. Explore AnimoSearch and use the Writing Guide to build your research foundation." },
]

export default function Quiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('animosearch-quiz-highscore') || '0') } catch { return 0 }
  })

  const question = quizQuestions[current]
  const total = quizQuestions.length
  const progress = ((current) / total) * 100

  const tier = SCORE_TIERS.find(t => score >= t.min)

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === question.correct) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= total) {
      setFinished(true)
      if (score > highScore) {
        setHighScore(score)
        try { localStorage.setItem('animosearch-quiz-highscore', String(score)) } catch {}
      }
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const restart = () => {
    setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setFinished(false)
  }

  if (finished) {
    return (
      <>
        <Helmet><title>Quiz Results — AnimoSearch</title></Helmet>
        <div className="min-h-screen bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] flex items-center justify-center px-4 pt-20">
          <div className="max-w-lg w-full text-center" data-aos="fade-up">
            <h1 className="font-display font-bold text-3xl text-[var(--color-ink)] dark:text-white mb-2">{tier.label}</h1>
            <div className="text-6xl font-display font-bold mb-2" style={{ color: tier.color }}>
              {score}<span className="text-2xl text-[var(--color-ink-muted)] dark:text-white/50">/{total}</span>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 mb-2">
              {highScore > score && `Personal best: ${highScore}/${total}`}
              {highScore === score && score > 0 && `New personal best!`}
            </p>
            <p className="text-[var(--color-ink-muted)] dark:text-white/70 mb-8 leading-relaxed">{tier.message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={restart} className="btn-primary">
                <RotateCcw size={16} aria-hidden="true" /> Play Again
              </button>
              <Link to="/theses" className="btn-outline">
                Browse Theses <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>DLSU Research Quiz — AnimoSearch</title>
        <meta name="description" content="Test your DLSU and academic research knowledge with 10 trivia questions. Colleges, history, research methods, and Animo Repository." />
      </Helmet>

      <div className="min-h-screen bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] flex items-center justify-center px-4 pt-20 pb-10">
        <div className="max-w-2xl w-full">

          {/* Header */}
          <div className="text-center mb-8" data-aos="fade-down">
            <span className="section-label">DLSU Research Trivia</span>
            <h1 className="font-display font-bold text-3xl text-[var(--color-ink)] dark:text-white">Research Quiz</h1>
          </div>

          {/* Progress */}
          <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 mb-4 border border-[var(--color-border-light)] dark:border-white/10" data-aos="fade-up">
            <div className="flex justify-between items-center mb-3">
              <span className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50">Question {current + 1} of {total}</span>
              <span className="font-label text-xs text-[var(--color-primary)]">Score: {score}</span>
            </div>
            <div className="h-2 bg-[var(--color-sky-muted)] dark:bg-white/10 rounded-full overflow-hidden" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
              <div className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500" style={{ width: `${((current + 1) / total) * 100}%` }} />
            </div>
          </div>

          {/* Question card */}
          <div
            key={`q-${current}`}
            className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-8 border border-[var(--color-border-light)] dark:border-white/10 mb-4"
            style={{ animation: 'fadeInUp 0.35s ease both' }}
          >
            <h2 className="font-display font-semibold text-xl text-[var(--color-ink)] dark:text-white mb-6 leading-snug">
              {question.question}
            </h2>

            <ul className="space-y-3" role="list">
              {question.options.map((opt, idx) => {
                let style = 'bg-[var(--color-sky-bg)] dark:bg-white/5 border-[var(--color-border-light)] dark:border-white/10 text-[var(--color-ink)] dark:text-white hover:border-[var(--color-primary)] hover:bg-[var(--color-sky-muted)] hover:text-[var(--color-ink)]'
                let icon = null

                if (answered) {
                  if (idx === question.correct) {
                    style = 'bg-green-50 dark:bg-green-900/20 border-green-400 text-green-700 dark:text-green-300'
                    icon = <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" aria-hidden="true" />
                  } else if (idx === selected) {
                    style = 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-600 dark:text-red-300'
                    icon = <XCircle size={18} className="text-red-400 flex-shrink-0" aria-hidden="true" />
                  } else {
                    style = 'bg-[var(--color-sky-bg)] dark:bg-white/5 border-[var(--color-border-light)] dark:border-white/10 text-[var(--color-ink-muted)] dark:text-white/40'
                  }
                }

                return (
                  <li key={idx} style={{ animation: `fadeInUp 0.3s ease ${idx * 60}ms both` }}>
                    <button
                      onClick={() => handleSelect(idx)}
                      disabled={answered}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm text-left transition-all ${answered ? 'cursor-default' : 'cursor-pointer'} ${style} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
                      aria-pressed={selected === idx}
                    >
                      <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-label text-xs flex-shrink-0 opacity-60">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {icon}
                    </button>
                  </li>
                )
              })}
            </ul>

            {answered && (
              <div className="mt-5 p-4 bg-[var(--color-sky-bg)] dark:bg-white/5 rounded-xl border border-[var(--color-border-light)] dark:border-white/10" style={{ animation: 'fadeInUp 0.3s ease both' }}>
                <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/70 leading-relaxed">
                  <span className="font-semibold text-[var(--color-primary)]">Explanation: </span>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>

          {answered && (
            <div className="text-right">
              <button onClick={handleNext} className="btn-primary" data-aos="fade-up">
                {current + 1 >= total ? (
                  <><Trophy size={16} aria-hidden="true" /> See Results</>
                ) : (
                  <>Next Question <ArrowRight size={16} aria-hidden="true" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Send, CheckCircle2, BookPlus, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const FORM_TYPES = [
  { id: 'missing', label: 'Submit a Missing Thesis', icon: BookPlus, description: 'Know of a DLSU thesis not in our database? Help us complete the record.' },
  { id: 'contact', label: 'General Inquiry', icon: MessageSquare, description: 'Questions, corrections, feedback, or anything else.' },
]

const COLLEGES = ['CCS', 'COE', 'COB', 'CLA', 'COS', 'SOE', 'GCOE', 'Other']
const DEGREE_LEVELS = ['Undergraduate / Capstone', 'Master\'s Thesis', 'Doctoral Dissertation']

function Field({ label, error, children }) {
  return (
    <div>
      <label className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 block mb-1.5">
        {label}
        <span className="block mt-1.5 font-normal">
          {children}
        </span>
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

export default function Submit() {
  const [formType, setFormType] = useState('missing')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [fields, setFields] = useState({
    name: '',
    email: '',
    // missing thesis fields
    thesis_title: '',
    thesis_author: '',
    thesis_year: '',
    thesis_college: '',
    thesis_degree: '',
    thesis_url: '',
    // general fields
    subject: '',
    message: '',
  })

  const set = (key, value) => setFields(prev => ({ ...prev, [key]: value }))

  const validate = () => {
    const e = {}
    if (!fields.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email address.'
    if (formType === 'missing') {
      if (!fields.thesis_title.trim()) e.thesis_title = 'Thesis title is required.'
      if (!fields.thesis_author.trim()) e.thesis_author = 'Author name is required.'
    } else {
      if (!fields.subject.trim()) e.subject = 'Subject is required.'
      if (!fields.message.trim()) e.message = 'Message is required.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        type: formType,
        name: fields.name.trim() || null,
        email: fields.email.trim(),
        ...(formType === 'missing' ? {
          thesis_title: fields.thesis_title.trim(),
          thesis_author: fields.thesis_author.trim(),
          thesis_year: fields.thesis_year ? parseInt(fields.thesis_year) : null,
          thesis_college: fields.thesis_college || null,
          thesis_degree: fields.thesis_degree || null,
          thesis_url: fields.thesis_url.trim() || null,
        } : {
          subject: fields.subject.trim(),
          message: fields.message.trim(),
        }),
        created_at: new Date().toISOString(),
      }
      const { error } = await supabase.from('submissions').insert([payload])
      if (error) throw error
      setSubmitted(true)
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again or contact us directly.' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-[var(--color-border-light)] dark:border-white/10 bg-white dark:bg-white/5 text-[var(--color-ink)] dark:text-white placeholder-[var(--color-ink-subtle)] dark:placeholder-white/30 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors'

  if (submitted) {
    return (
      <>
        <Helmet><title>Submitted — AnimoSearch</title></Helmet>
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] px-4 pt-20">
          <div className="max-w-md w-full text-center" data-aos="fade-up">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={32} className="text-green-500" aria-hidden="true" />
            </div>
            <h1 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-3">Submission Received</h1>
            <p className="text-sm text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed mb-6">
              Thank you for contributing to AnimoSearch. We will review your submission and update the database accordingly.
            </p>
            <button onClick={() => { setSubmitted(false); setFields({ name: '', email: '', thesis_title: '', thesis_author: '', thesis_year: '', thesis_college: '', thesis_degree: '', thesis_url: '', subject: '', message: '' }) }} className="btn-outline">
              Submit Another
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Submit / Contact — AnimoSearch</title>
        <meta name="description" content="Submit a missing DLSU thesis or send a general inquiry to the AnimoSearch team." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F0D]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Get in Touch</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Submit / Contact
          </h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Help us improve AnimoSearch by adding missing theses, or send a question or correction.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0D1F14] min-h-screen">
        <div className="container-lg py-12">
          <div className="max-w-2xl mx-auto">

            {/* Form type selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-aos="fade-up">
              {FORM_TYPES.map((type, i) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormType(type.id)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                      formType === type.id
                        ? 'border-[var(--color-primary)] bg-white dark:bg-[var(--color-card-dark)]'
                        : 'border-[var(--color-border-light)] dark:border-white/10 bg-white dark:bg-[var(--color-card-dark)] hover:border-[var(--color-primary)]/50'
                    }`}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    aria-pressed={formType === type.id}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formType === type.id ? 'bg-[var(--color-primary)]/10' : 'bg-[var(--color-sky-bg)] dark:bg-white/5'}`}>
                        <Icon size={16} className={formType === type.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)] dark:text-white/50'} aria-hidden="true" />
                      </div>
                      <span className={`font-semibold text-sm ${formType === type.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)] dark:text-white'}`}>
                        {type.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/50 leading-relaxed">{type.description}</p>
                  </button>
                )
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10 space-y-5" noValidate data-aos="fade-up" data-aos-delay="150">

              {/* Shared fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Your Name (optional)">
                  <input type="text" value={fields.name} onChange={e => set('name', e.target.value)} placeholder="Juan dela Cruz" className={inputClass} />
                </Field>
                <Field label="Email *" error={errors.email}>
                  <input type="email" value={fields.email} onChange={e => set('email', e.target.value)} placeholder="juan@dlsu.edu.ph" className={inputClass} required />
                </Field>
              </div>

              {formType === 'missing' && (
                <>
                  <Field label="Thesis Title *" error={errors.thesis_title}>
                    <input type="text" value={fields.thesis_title} onChange={e => set('thesis_title', e.target.value)} placeholder="Full thesis title" className={inputClass} required />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Author(s) *" error={errors.thesis_author}>
                      <input type="text" value={fields.thesis_author} onChange={e => set('thesis_author', e.target.value)} placeholder="Last, First M." className={inputClass} required />
                    </Field>
                    <Field label="Year">
                      <input type="number" value={fields.thesis_year} onChange={e => set('thesis_year', e.target.value)} placeholder="e.g. 2022" min="1980" max="2099" className={inputClass} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="College">
                      <select value={fields.thesis_college} onChange={e => set('thesis_college', e.target.value)} className={inputClass + ' cursor-pointer'}>
                        <option value="">Select college</option>
                        {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Degree Level">
                      <select value={fields.thesis_degree} onChange={e => set('thesis_degree', e.target.value)} className={inputClass + ' cursor-pointer'}>
                        <option value="">Select level</option>
                        {DEGREE_LEVELS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Animo Repository URL (if you have it)">
                    <input type="url" value={fields.thesis_url} onChange={e => set('thesis_url', e.target.value)} placeholder="https://animorepository.dlsu.edu.ph/..." className={inputClass} />
                  </Field>
                </>
              )}

              {formType === 'contact' && (
                <>
                  <Field label="Subject *" error={errors.subject}>
                    <input type="text" value={fields.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Data correction for thesis ID..." className={inputClass} required />
                  </Field>
                  <Field label="Message *" error={errors.message}>
                    <textarea value={fields.message} onChange={e => set('message', e.target.value)} placeholder="Describe your inquiry..." rows={5} className={inputClass + ' resize-none'} required />
                  </Field>
                </>
              )}

              {errors.submit && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">{errors.submit}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" style={{ transition: 'all 0.3s ease' }}>
                {loading ? 'Submitting...' : <><Send size={14} aria-hidden="true" /> Submit</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, Send, CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

const INITIAL = { name: '', email: '', destination_interest: '', travel_dates: '', group_size: '', message: '' }

const validate = (form) => {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address'
  if (!form.message.trim()) errors.message = 'Message is required'
  if (form.group_size && (isNaN(form.group_size) || Number(form.group_size) < 1)) errors.group_size = 'Enter a valid number'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStatus('loading')
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: form.name,
        email: form.email,
        destination_interest: form.destination_interest || null,
        travel_dates: form.travel_dates || null,
        group_size: form.group_size ? parseInt(form.group_size) : null,
        message: form.message,
      }])
      if (error) throw error
      setStatus('success')
      setForm(INITIAL)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  const FAQ = [
    { q: 'Do you offer customized tour packages?', a: 'Yes! Fill out the inquiry form with your preferred destinations and travel dates and we\'ll help you build a custom itinerary.' },
    { q: 'How far in advance should I book?', a: 'For peak season (December-February) we recommend booking at least 4-6 weeks in advance. Off-peak travel can often be arranged within 1-2 weeks.' },
    { q: 'What is the best island to visit for first-timers?', a: 'We typically recommend Boracay or Cebu as bases for first-time visitors — both are well-connected, have great accommodations at all budgets, and are excellent jumping-off points for day trips.' },
    { q: 'Is the Philippines safe for solo travelers?', a: 'Yes, the Philippines is generally safe for solo travelers, especially in popular tourist areas. Standard travel safety precautions apply — be aware of your surroundings, keep valuables secure, and use registered transport.' },
  ]

  return (
    <>
      <Helmet>
        <title>Contact & Trip Inquiry — Lakbay PH</title>
        <meta name="description" content="Plan your Philippines trip with Lakbay PH. Submit a trip inquiry and we'll help you build the perfect itinerary." />
      </Helmet>

      <section className="pt-28 pb-12 bg-[var(--color-ink)] dark:bg-[#080F17]">
        <div className="container-lg">
          <span className="font-label text-xs tracking-[0.15em] text-[var(--color-secondary-light)] block mb-3">Get in Touch</span>
          <h1 className="font-display font-bold text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Trip Inquiry</h1>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Ready to plan your Philippine adventure? Send us your details and we'll help you build the perfect itinerary.
          </p>
        </div>
      </section>

      <div className="bg-[var(--color-sky-bg)] dark:bg-[#0F1923] min-h-screen">
        <div className="container-lg py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-10 border border-[var(--color-border-light)] dark:border-white/10 text-center" data-aos="fade-up">
                  <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" aria-hidden="true" />
                  <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] dark:text-white mb-3">Inquiry Sent!</h2>
                  <p className="text-[var(--color-ink-muted)] dark:text-white/70 mb-6">
                    Thank you for reaching out. We've received your trip inquiry and will get back to you within 24-48 hours.
                  </p>
                  <button onClick={() => setStatus(null)} className="btn-outline">Send Another Inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-8 border border-[var(--color-border-light)] dark:border-white/10 space-y-5" data-aos="fade-up">
                  <h2 className="font-display font-bold text-xl text-[var(--color-ink)] dark:text-white mb-2">Tell us about your trip</h2>

                  {status === 'error' && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl" role="alert">
                      <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="text-sm text-red-600 dark:text-red-300">{errorMsg}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5 block">
                        Full Name <span className="text-red-400" aria-hidden="true">*</span>
                      </label>
                      <input id="name" name="name" type="text" value={form.name} onChange={handleChange}
                        className={`input ${errors.name ? 'border-red-400 focus:border-red-400 focus:shadow-none' : ''}`}
                        placeholder="Your full name" aria-required="true" aria-describedby={errors.name ? 'name-error' : undefined} />
                      {errors.name && <p id="name-error" className="text-xs text-red-500 mt-1" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5 block">
                        Email <span className="text-red-400" aria-hidden="true">*</span>
                      </label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange}
                        className={`input ${errors.email ? 'border-red-400 focus:border-red-400 focus:shadow-none' : ''}`}
                        placeholder="your@email.com" aria-required="true" aria-describedby={errors.email ? 'email-error' : undefined} />
                      {errors.email && <p id="email-error" className="text-xs text-red-500 mt-1" role="alert">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="destination_interest" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5 block">
                      Destinations of Interest
                    </label>
                    <input id="destination_interest" name="destination_interest" type="text" value={form.destination_interest} onChange={handleChange}
                      className="input" placeholder="e.g. Boracay, El Nido, Siargao" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="travel_dates" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5 block">
                        Preferred Travel Dates
                      </label>
                      <input id="travel_dates" name="travel_dates" type="text" value={form.travel_dates} onChange={handleChange}
                        className="input" placeholder="e.g. March 15-25, 2025" />
                    </div>
                    <div>
                      <label htmlFor="group_size" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5 block">
                        Group Size
                      </label>
                      <input id="group_size" name="group_size" type="number" min="1" max="100" value={form.group_size} onChange={handleChange}
                        className={`input ${errors.group_size ? 'border-red-400' : ''}`} placeholder="Number of travelers"
                        aria-describedby={errors.group_size ? 'group-error' : undefined} />
                      {errors.group_size && <p id="group-error" className="text-xs text-red-500 mt-1" role="alert">{errors.group_size}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="font-label text-xs text-[var(--color-ink-muted)] dark:text-white/50 mb-1.5 block">
                      Message <span className="text-red-400" aria-hidden="true">*</span>
                    </label>
                    <textarea id="message" name="message" rows={4} value={form.message} onChange={handleChange}
                      className={`input resize-none ${errors.message ? 'border-red-400 focus:border-red-400 focus:shadow-none' : ''}`}
                      placeholder="Tell us about your ideal trip — activities, budget, special requirements…"
                      aria-required="true" aria-describedby={errors.message ? 'message-error' : undefined} />
                    {errors.message && <p id="message-error" className="text-xs text-red-500 mt-1" role="alert">{errors.message}</p>}
                  </div>

                  <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />Sending…</span>
                    ) : (
                      <><Send size={16} aria-hidden="true" /> Send Inquiry</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-5">Contact Info</h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'hello@lakbayphtravel.ph' },
                    { icon: Phone, label: '+63 (2) 8XXX XXXX' },
                    { icon: MapPin, label: 'Metro Manila, Philippines' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-[var(--color-ink-muted)] dark:text-white/60">
                      <Icon size={16} className="text-[var(--color-primary)] flex-shrink-0" aria-hidden="true" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-[var(--color-card-dark)] rounded-2xl p-6 border border-[var(--color-border-light)] dark:border-white/10">
                <h3 className="font-display font-bold text-lg text-[var(--color-ink)] dark:text-white mb-4">FAQ</h3>
                <div className="space-y-4">
                  {FAQ.map(({ q, a }) => (
                    <div key={q}>
                      <p className="font-semibold text-sm text-[var(--color-ink)] dark:text-white mb-1">{q}</p>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-white/60 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}

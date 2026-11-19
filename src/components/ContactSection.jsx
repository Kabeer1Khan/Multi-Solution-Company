import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { ArrowRight, Check, LocateFixed, Mail, MapPin, Minus, Phone, Plus } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ease = [0.16, 1, 0.3, 1]

// Edit your details here
const PHONE = { label: '+92 335 3977433', note: 'Mon – Sat, 9:00 am – 6:00 pm', href: 'tel:+923353977433' }
const EMAIL = { label: 'info@multisolution.com', href: 'mailto:info@multisolution.com' }
// Map position: Johar Mor / Perfume Chowk, Gulistan-e-Jauhar, Karachi. To pin your exact office, right-click it in
// Google Maps, click the coordinates at the top of the menu to copy them, and paste them here.
const LOCATION = { lat: 24.9151, lng: 67.1291 }
const OFFICE_NAME = 'Multi Solution Company'
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.lat},${LOCATION.lng}`
const ADDRESS = { label: 'Johar Mor, Perfume Chowk, Gulistan-e-Jauhar, Karachi', href: DIRECTIONS }
// Paste a Formspree / EmailJS / your own API URL to really send the form. Empty = the form only simulates sending.
const FORM_ENDPOINT = ''

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const slideV = { hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.9, ease } } }
const popV = { hidden: { scale: 0, rotate: -30 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 14 } } }
const cardV = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  show: (i = 0) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, delay: i * 0.15, ease, staggerChildren: 0.1, delayChildren: 0.3 } }),
}
const cardCls = 'rounded-3xl border border-white bg-gradient-to-br from-white to-blue-50/70 p-6 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.18)] sm:p-8 md:p-10'
const vp = { once: true, amount: 0.2 }

const Words = ({ text }) =>
  text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
      <motion.span variants={wordV} className="inline-block">{w}</motion.span>
    </span>
  ))

const info = [
  { icon: Phone, ...PHONE },
  { icon: Mail, ...EMAIL },
  { icon: MapPin, ...ADDRESS, external: true },
]

const fieldCls =
  'peer w-full rounded-xl border border-slate-200 bg-white/70 px-4 pb-2 pt-6 text-sm text-blue-950 outline-none transition duration-300 hover:border-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15'
const labelCls =
  'pointer-events-none absolute left-4 top-4 text-sm text-slate-400 transition-all duration-300 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs'

function Field({ id, label, textarea, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <motion.div variants={fadeV} className="relative">
      <Tag id={id} name={id} placeholder=" " required rows={textarea ? 4 : undefined} className={`${fieldCls} ${textarea ? 'resize-none' : ''}`} {...props} />
      <label htmlFor={id} className={labelCls}>{label}</label>
    </motion.div>
  )
}

function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const submit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        if (!res.ok) throw new Error('failed')
      } else {
        await new Promise((r) => setTimeout(r, 1200))
      }
      form.reset()
      setStatus('sent')
      setTimeout(() => setStatus('idle'), 4500)
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <Field id="name" label="Your Name" type="text" autoComplete="name" />
      <Field id="email" label="Your Email" type="email" autoComplete="email" />
      <Field id="message" label="Your Message" textarea />
      <motion.div variants={fadeV} className="flex flex-col items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group relative inline-flex min-w-[190px] items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50 disabled:opacity-80"
        >
          <span className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[700%]" />
          {status === 'sending' ? (
            <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : status === 'sent' ? (
            <Check size={18} className="relative" />
          ) : (
            <ArrowRight size={16} className="relative order-2 transition-transform duration-300 group-hover:translate-x-1.5" />
          )}
          <span className="relative">{status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Send Message'}</span>
        </button>
        <AnimatePresence>
          {(status === 'sent' || status === 'error') && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm ${status === 'sent' ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {status === 'sent' ? 'Thank you! We’ll get back to you soon.' : 'Something went wrong. Please try again.'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  )
}

// Real, draggable map (Leaflet + dark OpenStreetMap/CARTO tiles). Needs: npm install leaflet
const TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const pinHtml = `
<div class="relative">
  <span class="absolute left-0 top-0 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-sky-400/40"></span>
  <div class="absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center">
    <span class="mb-1 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-950 shadow-lg">${OFFICE_NAME}</span>
    <svg width="42" height="42" viewBox="0 0 24 24" class="drop-shadow-lg"><path d="M12 22s-7-6.1-7-12a7 7 0 1 1 14 0c0 5.9-7 12-7 12z" fill="#38bdf8" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>
  </div>
</div>`

const mapBtn =
  'grid h-10 w-10 place-items-center rounded-xl bg-white/95 text-blue-950 shadow-lg transition duration-200 hover:bg-blue-600 hover:text-white active:scale-90'

function InteractiveMap() {
  const wrap = useRef(null)
  const el = useRef(null)
  const mapRef = useRef(null)
  const inView = useInView(wrap, { once: true, amount: 0.4 })
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const [unlocked, setUnlocked] = useState(!touch) // phones: tap once to explore, so the page can still scroll
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const map = L.map(el.current, {
      center: [LOCATION.lat + 0.03, LOCATION.lng - 0.05], // starts zoomed out, then flies in
      zoom: 12,
      zoomSnap: 0.5,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: !touch,
      touchZoom: !touch,
    })
    L.tileLayer(TILES, { subdomains: 'abcd', maxZoom: 20, attribution: '© OpenStreetMap contributors © CARTO' }).addTo(map)
    const icon = L.divIcon({ className: '', html: pinHtml, iconSize: [0, 0], iconAnchor: [0, 0] })
    L.marker([LOCATION.lat, LOCATION.lng], { icon, title: OFFICE_NAME })
      .addTo(map)
      .bindPopup(`<b>${OFFICE_NAME}</b><br/>${ADDRESS.label}`, { offset: [0, -48] })
    map.on('click', () => map.scrollWheelZoom.enable()) // click once, then the wheel zooms
    map.on('dragstart', () => setHint(false))
    map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable())
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [touch])

  useEffect(() => {
    const m = mapRef.current
    if (!m) return
    if (unlocked) { m.dragging.enable(); m.touchZoom.enable() } else { m.dragging.disable(); m.touchZoom.disable() }
  }, [unlocked])

  // entry animation: fly from the city view into the office
  useEffect(() => {
    if (inView && mapRef.current) mapRef.current.flyTo([LOCATION.lat, LOCATION.lng], 16, { duration: 3 })
  }, [inView])

  const recenter = () => mapRef.current?.flyTo([LOCATION.lat, LOCATION.lng], 16, { duration: 1.2 })

  return (
    <motion.div ref={wrap} custom={2} variants={cardV} initial="hidden" whileInView="show" viewport={vp} className="mt-5">
      <div className="relative isolate h-[340px] overflow-hidden rounded-3xl shadow-2xl shadow-blue-950/30 md:h-[440px]">
        <div ref={el} style={{ background: '#0a1020' }} className="absolute inset-0" />

        {/* top-left: hint / lock */}
        <div className="pointer-events-none absolute left-3 top-3 z-[1100] md:left-4 md:top-4">
          <AnimatePresence>
            {touch && unlocked ? (
              <motion.button key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setUnlocked(false)} className="pointer-events-auto rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-blue-950 shadow-lg">
                Done
              </motion.button>
            ) : (
              !touch && hint && (
                <motion.span key="hint" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 3.2 }} className="inline-block rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-blue-950 shadow-lg">
                  Drag to move · click, then scroll to zoom
                </motion.span>
              )
            )}
          </AnimatePresence>
        </div>

        {/* top-right: directions */}
        <a href={DIRECTIONS} target="_blank" rel="noreferrer" className="group absolute right-3 top-3 z-[1100] inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/40 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500 md:right-4 md:top-4">
          Get Directions <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>

        {/* bottom-right: zoom + recenter */}
        <div className="absolute bottom-8 right-3 z-[1100] flex flex-col gap-2 md:right-4">
          <button aria-label="Zoom in" onClick={() => mapRef.current?.zoomIn()} className={mapBtn}><Plus size={18} /></button>
          <button aria-label="Zoom out" onClick={() => mapRef.current?.zoomOut()} className={mapBtn}><Minus size={18} /></button>
          <button aria-label="Back to our office" onClick={recenter} className={mapBtn}><LocateFixed size={18} /></button>
        </div>

        {/* phones: tap to start exploring */}
        {touch && !unlocked && (
          <button onClick={() => setUnlocked(true)} className="absolute inset-0 z-[1050] grid place-items-center bg-[#050f2c]/25" aria-label="Tap to explore the map">
            <span className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-blue-950 shadow-lg">Tap to explore the map</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function ContactSection() {
  return (
    <section className="bg-[#f3f6fc] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
          {/* Get in Touch */}
          <motion.div custom={0} variants={cardV} initial="hidden" whileInView="show" viewport={vp} className={cardCls}>
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl"><Words text="Get in Touch" /></h2>
            <motion.p variants={fadeV} className="mt-4 max-w-sm text-base leading-relaxed text-slate-600 md:text-lg">
              We’re here to help. Reach out to us for any inquiries, support or partnership opportunities.
            </motion.p>
            <ul className="mt-8">
              {info.map(({ icon: Icon, label, note, href, external }, k) => (
                <motion.li key={label} variants={slideV} className={k > 0 ? 'border-t border-slate-200/80' : ''}>
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="group flex items-center gap-4 py-4 transition-transform duration-300 hover:translate-x-2"
                  >
                    <motion.span variants={popV}>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-100 text-blue-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30">
                        <Icon size={20} />
                      </span>
                    </motion.span>
                    <span>
                      <span className="block text-base font-semibold text-blue-950 transition-colors duration-300 group-hover:text-blue-600">{label}</span>
                      {note && <span className="block text-xs text-slate-500">{note}</span>}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Send Message */}
          <motion.div custom={1} variants={cardV} initial="hidden" whileInView="show" viewport={vp} className={cardCls}>
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl"><Words text="Send Message" /></h2>
            <ContactForm />
          </motion.div>
        </div>

        <InteractiveMap />
      </div>
    </section>
  )
}
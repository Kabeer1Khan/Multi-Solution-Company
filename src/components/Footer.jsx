import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUp, Mail, MapPin, Phone, Play } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

const quick = [['Home', '/'], ['About', '/about'], ['Solution', '/solution'], ['Products', '/products'], ['Industries', '/industries'], ['Contact', '/contact']]
const products = [['Zinc Cables', '/products'], ['Zinc Switches', '/products'], ['Smart Solutions', '/solution'], ['Technical Support', '/contact']]
// Brand icons are plain text/shapes so nothing breaks if your lucide version has no brand icons
const socials = [
  { label: 'Facebook', node: <span className="text-lg font-bold">f</span> },
  { label: 'LinkedIn', node: <span className="text-sm font-bold">in</span> },
  { label: 'YouTube', node: <Play size={14} fill="currentColor" /> },
  { label: 'X', node: <span className="text-sm font-bold">X</span> },
]

const colV = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease } } }

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="group relative inline-block text-sm text-slate-600 transition-all duration-300 hover:translate-x-1 hover:text-blue-600">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

export default function Footer() {
  const [showTop, setShowTop] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setShowTop(y > 700))

  return (
    <footer className="relative overflow-hidden bg-white">
      {/* decorative blue swoosh */}
      <motion.svg
        initial={{ x: 140, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease }}
        viewBox="0 0 500 120"
        className="pointer-events-none absolute bottom-14 right-0 h-20 w-[55%] max-w-xl sm:h-24"
      >
        <path d="M0 120 C 140 90, 300 100, 500 0 L500 120 Z" fill="#1d4ed8" />
        <path d="M130 120 C 260 100, 390 70, 500 40 L500 120 Z" fill="#0b1b3a" />
      </motion.svg>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pt-14 md:px-8 md:pt-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]"
        >
          {/* Brand */}
          <motion.div variants={colV}>
            <Link to="/" className="group inline-flex items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-11 w-11 transition-transform duration-500 group-hover:rotate-90">
                <circle cx="32" cy="32" r="29" fill="#0b1b3a" />
                <rect x="18" y="18" width="12" height="12" rx="3" fill="#2563eb" />
                <rect x="34" y="18" width="12" height="12" rx="3" fill="#60a5fa" />
                <rect x="18" y="34" width="12" height="12" rx="3" fill="#60a5fa" />
                <rect x="34" y="34" width="12" height="12" rx="3" fill="#3b82f6" />
              </svg>
              <span className="leading-none">
                <span className="block text-xl font-bold tracking-tight text-blue-950">Multi Solution</span>
                <span className="mt-1 block text-[10px] tracking-[0.5em] text-blue-700">COMPANY</span>
              </span>
            </Link>
            <p className="mt-5 max-w-[14rem] text-sm leading-relaxed text-slate-500">Building a Connected, Brighter Future.</p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-blue-950 text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/40"
                >
                  {s.node}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={colV} className="lg:border-l lg:border-slate-200 lg:pl-10">
            <h4 className="mb-5 text-base font-semibold text-blue-950">Quick Links</h4>
            <ul className="space-y-3">
              {quick.map(([l, to]) => (
                <li key={l}><FooterLink to={to}>{l}</FooterLink></li>
              ))}
            </ul>
          </motion.div>

          {/* Products */}
          <motion.div variants={colV} className="lg:border-l lg:border-slate-200 lg:pl-10">
            <h4 className="mb-5 text-base font-semibold text-blue-950">Our Products</h4>
            <ul className="space-y-3">
              {products.map(([l, to]) => (
                <li key={l}><FooterLink to={to}>{l}</FooterLink></li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={colV} className="lg:border-l lg:border-slate-200 lg:pl-10">
            <h4 className="mb-5 text-base font-semibold text-blue-950">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              {[
                [Phone, '+92 335 3977433', 'tel:+923353977433'],
                [Mail, 'info@multisolution.com', 'mailto:info@multisolution.com'],
                [MapPin, 'Karachi, Pakistan', null],
              ].map(([Icon, text, href]) => (
                <li key={text}>
                  <a href={href ?? undefined} className="group flex items-center gap-3 transition-colors hover:text-blue-600">
                    <Icon size={16} className="text-blue-600 transition-transform duration-300 group-hover:scale-125" />
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-12 flex flex-col gap-1 border-t border-slate-200 py-5 text-xs font-medium text-blue-950 sm:flex-row sm:justify-between sm:text-sm"
        >
          <span>© {new Date().getFullYear()} Multi Solution Company. All Rights Reserved.</span>
          <span>Powering a Smarter Tomorrow.</span>
        </motion.div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ y: -4 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40 transition-colors hover:bg-blue-500"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}
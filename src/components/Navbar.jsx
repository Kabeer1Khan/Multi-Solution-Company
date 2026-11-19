import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ArrowRight, MapPin, Menu, X } from 'lucide-react'

const links = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Solution', '/solution'],
  ['Products', '/products'],
  ['Industries', '/industries'],
]

const ease = [0.16, 1, 0.3, 1]

function Logo({ solid }) {
  return (
    <Link to="/" className="group flex items-center gap-2 sm:gap-3" aria-label="Multi Solution Company home">
      <svg viewBox="0 0 64 64" className="h-8 w-8 transition-transform duration-500 group-hover:rotate-90 sm:h-10 sm:w-10 md:h-11 md:w-11">
        <circle cx="32" cy="32" r="29" className={`transition-colors duration-500 ${solid ? 'fill-white/15' : 'fill-[#0b1b3a]'}`} />
        <rect x="18" y="18" width="12" height="12" rx="3" fill="#2563eb" />
        <rect x="34" y="18" width="12" height="12" rx="3" fill="#60a5fa" />
        <rect x="18" y="34" width="12" height="12" rx="3" fill="#60a5fa" />
        <rect x="34" y="34" width="12" height="12" rx="3" fill="#3b82f6" />
      </svg>
      <span className="leading-none">
        <span className={`block whitespace-nowrap text-sm font-bold tracking-tight transition-colors duration-500 sm:text-lg md:text-xl ${solid ? 'text-white' : 'text-slate-900'}`}>
          Multi Solution
        </span>
        <span className={`mt-1 block text-[7px] tracking-[0.5em] transition-colors duration-500 sm:text-[9px] md:text-[10px] ${solid ? 'text-blue-300' : 'text-blue-700'}`}>
          COMPANY
        </span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 220) // hide on scroll down, show on scroll up
    setScrolled(y > 40)
  })
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const heroPage = ['/', '/about', '/solution', '/products', '/industries', '/contact'].includes(pathname)
  const solid = scrolled || !heroPage

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !open ? -140 : 0 }}
      transition={{ duration: 0.7, ease }}
      className="fixed inset-x-0 top-0 z-50 px-1.5 pt-1.5 md:px-2 md:pt-2"
    >
      <div
        className={`relative rounded-3xl transition-all duration-500 ${
          solid
            ? 'h-[60px] bg-blue-950/60 shadow-2xl shadow-blue-950/30 ring-1 ring-white/10 backdrop-blur-lg sm:h-[68px] md:h-[76px]'
            : 'h-[64px] sm:h-[76px] md:h-[88px]'
        }`}
      >
        {/* Desktop nav pill */}
        <motion.nav
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.1, delay: 0.9, ease }}
          className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-xl border border-white/15 bg-white/10 p-1.5 xl:flex min-[1440px]:gap-1.5 2xl:left-6 2xl:gap-2">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="relative whitespace-nowrap rounded-lg px-5 py-3 text-sm font-medium tracking-[0.01em] text-white/80 transition-colors hover:bg-white/10 hover:text-white min-[1440px]:px-6 2xl:px-7"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg shadow-blue-600/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-white' : ''}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </motion.nav>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 sm:left-4 sm:h-11 sm:w-11 place-items-center rounded-xl bg-white/10 text-white transition hover:bg-blue-600 xl:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Center logo notch */}
        <motion.div
          initial={{ y: -110 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 130, damping: 18, delay: 0.7 }}
          className={`absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-center rounded-b-3xl px-3 transition-all duration-500 sm:px-5 md:px-9 ${
            solid ? 'bg-white/10 ring-1 ring-white/15' : 'bg-white shadow-xl shadow-blue-950/10'
          }`}
        >
          <Logo solid={solid} />
        </motion.div>

        {/* Right actions */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 sm:right-4 md:right-6">
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 1, ease }}
            className="flex items-center gap-3"
          >
          <Link
            to="/tracking"
            className="group hidden items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 xl:flex"
          >
            Tracking Package
            <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white transition group-hover:bg-blue-600">
              <MapPin size={13} />
            </span>
          </Link>
          <Link
            to="/contact"
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-2.5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50 sm:px-4 sm:py-3"
          >
            <span className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative hidden sm:inline">Get in touch with us</span>
            <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white text-blue-700 transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={13} />
            </span>
          </Link>
          </motion.div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
            className="mt-2 rounded-3xl bg-blue-950/95 p-3 xl:hidden"
          >
            {[...links, ['Tracking Package', '/tracking']].map(([label, to], i) => (
              <motion.div key={to} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-base font-medium transition ${
                      isActive ? 'bg-blue-600 text-white' : 'text-white/80 hover:bg-white/10'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
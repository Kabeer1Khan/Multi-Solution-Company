import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { animate, AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import heroImg from '../assets/home_page/hero.webp'

const ease = [0.16, 1, 0.3, 1] // smooth expo-out

const slides = [
  {
    lines: ['Smarter Transport. Faster', 'Deliveries. Nationwide Reach.'],
    text: 'Experience technology-driven transport solutions built for speed, safety, and efficiency — from freight and logistics to last-mile delivery.',
  },
  {
    lines: ['Electrical Supplies. Delivered', 'Safely. Right On Schedule.'],
    text: 'Cables, switches, lighting and smart-home essentials — handled with care from our warehouse straight to your site.',
  },
  {
    lines: ['One Partner. Multiple', 'Solutions. Zero Delays.'],
    text: 'Transport, warehousing, supply and installation support managed under one roof, so your projects never wait.',
  },
]

const stats = [
  { to: 25, suffix: '+', label: 'Years of Logistics Expertise' },
  { to: 1.2, dec: 1, suffix: 'M+', label: 'Successful Deliveries' },
  { to: 180, suffix: '+', label: 'Global Shipping Destinations' },
]

const rise = {
  hidden: { y: '115%', rotate: 3, opacity: 0 },
  show: { y: 0, rotate: 0, opacity: 1, transition: { duration: 1.2, ease } },
  exit: { y: '-115%', opacity: 0, transition: { duration: 0.5, ease } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.3 } },
}

function Counter({ to, dec = 0, suffix, delay = 2, duration = 2.4, amount = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  useEffect(() => {
    if (!inView) return
    // writes straight to the DOM: no React re-render on every frame
    const c = animate(0, to, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(dec) + suffix
      },
    })
    return () => c.stop()
  }, [inView, to, dec, suffix, delay, duration])
  return <span ref={ref}>{(0).toFixed(dec) + suffix}</span>
}

export default function Hero() {
  const [i, setI] = useState(0)
  const [ready, setReady] = useState(false) // true once the intro has finished
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2600)
    return () => clearTimeout(t)
  }, [])
  const go = (d) => setI((p) => (p + d + slides.length) % slides.length)
  const s = slides[i]

  // Scroll parallax
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [14, -14]), { stiffness: 50, damping: 20 })
  const py = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 50, damping: 20 })
  const onMove = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  return (
    <section ref={ref} className="relative p-1.5 md:p-2">
      {/* Frame opens up from the centre */}
      <motion.div
        onMouseMove={onMove}
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.6, ease }}
        className="relative isolate h-[calc(100svh-0.75rem)] min-h-[620px] sm:min-h-[700px] overflow-hidden rounded-3xl bg-[#040a1c] md:h-[calc(100svh-1rem)]"
      >
        {/* Background image: un-blurs and settles */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 will-change-transform">
          <motion.img
            src={heroImg}
            alt="Modern home at night with electrical cables, switches and lighting"
            style={{ x: px, y: py }}
            initial={{ scale: 1.3, opacity: 0.3 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 2.6, ease }}
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover object-right"
          />
        </motion.div>

        {/* Light overlays: only enough for readable text, image stays vivid */}
        <div className="absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-[#040a1c]/80 via-[#040a1c]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#040a1c]/70 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#040a1c]/50 to-transparent" />

        {/* Content */}
        <motion.div
          style={{ y: textY, opacity: fade }}
          className="absolute inset-0 flex flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24 md:px-12 lg:pb-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                show: { transition: { staggerChildren: 0.16, delayChildren: ready ? 0.3 : 1 } },
                exit: { transition: { staggerChildren: 0.06 } },
              }}
            >
              <h1 className="text-[1.7rem] min-[380px]:text-[1.95rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl 2xl:text-[3.4rem]">
                {s.lines.map((l) => (
                  <span key={l} className="block overflow-hidden pb-1.5">
                    <motion.span variants={rise} className="block origin-left lg:whitespace-nowrap">
                      {l}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p variants={fadeUp} className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base md:text-lg">
                {s.text}
              </motion.p>
              <motion.div variants={fadeUp} className="mt-6 sm:mt-8">
                <Link
                  to="/solution"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-xl transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-blue-700 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                  <span className="relative transition-colors duration-300 group-hover:text-white">See How It Works</span>
                  <span className="relative grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-blue-700">
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Stats: dividers draw down, numbers count up */}
          <div className="mt-8 flex items-stretch sm:mt-10 md:mt-14">
            {stats.map((st, k) => (
              <motion.div
                key={st.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 1.9 + k * 0.18, ease }}
                whileHover={{ y: -6 }}
                className={`group relative cursor-default ${k > 0 ? 'pl-4 sm:pl-8 md:pl-10' : ''} ${k < 2 ? 'pr-4 sm:pr-8 md:pr-10' : ''}`}
              >
                {k > 0 && (
                  <motion.span
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, delay: 2.1 + k * 0.18, ease }}
                    className="absolute left-0 top-0 h-full w-px origin-top bg-white/25"
                  />
                )}
                <div className="text-3xl font-light text-white transition-colors duration-300 group-hover:text-blue-400 sm:text-4xl md:text-5xl">
                  <Counter {...st} delay={2} />
                </div>
                <p className="mt-3 max-w-[10rem] text-xs text-white/70 sm:text-sm md:text-base">{st.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Slider card: sits outside the clipped frame so its corner stays clean */}
      <motion.div
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 2.3, ease }}
        className="absolute bottom-1.5 right-1.5 flex items-center gap-2 rounded-tl-2xl bg-white py-2.5 pl-4 pr-3 sm:gap-3 sm:rounded-tl-3xl sm:py-4 sm:pl-6 sm:pr-5 md:bottom-2 md:right-2 md:gap-4 md:py-5 md:pl-10 md:pr-8"
      >
        {[
          ['Previous slide', -1, ArrowLeft],
          ['Next slide', 1, ArrowRight],
        ].map(([label, d, Icon]) => (
          <button
            key={label}
            aria-label={label}
            onClick={() => go(d)}
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 sm:h-10 sm:w-10 md:h-11 md:w-11 text-white transition duration-300 hover:scale-110 hover:bg-blue-600 active:scale-95"
          >
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]" />
          </button>
        ))}
        <div className="relative h-[3px] w-10 overflow-hidden rounded-full bg-slate-200 sm:w-20 md:w-28 lg:w-36">
          <motion.span
            key={i}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 6, ease: 'linear', delay: ready ? 0 : 2.6 }}
            onAnimationComplete={() => go(1)}
            className="absolute inset-y-0 left-0 bg-blue-600"
          />
        </div>
        <span className="w-6 text-right text-lg font-light text-slate-900 sm:w-8 sm:text-xl md:text-2xl">{String(i + 1).padStart(2, '0')}</span>
      </motion.div>
    </section>
  )
}
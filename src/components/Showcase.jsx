import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Handshake, ShieldCheck, Trophy, Users } from 'lucide-react'

// new URL(...) keeps the page alive even if a file name is mistyped (image just won't show)
const cableImg = new URL('../assets/home_page/Glossy Colourful Cable Coils.webp', import.meta.url).href
const switchImg = new URL('../assets/home_page/Glossy Three-Switch Wall Panel.webp', import.meta.url).href

const ease = [0.16, 1, 0.3, 1]

const products = [
  { lines: ['Zinc', 'Cables'], sub: ['High-Quality', 'Copper Cables'], img: cableImg, alt: 'Coils of red, blue and yellow copper cables', to: '/products' },
  { lines: ['Zinc', 'Switches'], sub: ['Smart Switches', 'for Modern Living'], img: switchImg, alt: 'Glossy three-switch wall panel', to: '/products' },
]

const stats = [
  { icon: Trophy, to: 25, suffix: '+', label: 'Years of Excellence' },
  { icon: Users, to: 1.2, dec: 1, suffix: 'M+', label: 'Happy Customers' },
  { icon: Handshake, to: 180, suffix: '+', label: 'Dealer Network' },
  { icon: ShieldCheck, to: 99.9, dec: 1, suffix: '%', label: 'Product Reliability' },
]

const cardV = {
  hidden: { opacity: 0, y: 90, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease, staggerChildren: 0.12, delayChildren: 0.35 } },
}
const riseV = { hidden: { y: '115%', rotate: 3 }, show: { y: 0, rotate: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const picV = {
  hidden: { opacity: 0, scale: 0.75, rotate: -10, x: 70 },
  show: { opacity: 1, scale: 1, rotate: 0, x: 0, transition: { duration: 1.4, ease, delay: 0.2 } },
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

function ProductCard({ p, i }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [35, -35]) // image drifts while scrolling

  return (
    <div ref={ref} className="h-full">
      <motion.div variants={cardV} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="h-full">
        <div className="group relative h-full min-h-[260px] overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-white via-white to-blue-50 p-7 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.18)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.35)] md:min-h-[320px] md:p-10">
          {/* soft glow + hover shine */}
          <div className="absolute right-0 top-0 h-full w-3/5 bg-[radial-gradient(circle_at_70%_40%,rgba(59,130,246,0.16),transparent_65%)] transition-opacity duration-500 group-hover:opacity-100 md:opacity-80" />
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-[550%] group-hover:opacity-100" />

          {/* text */}
          <div className="relative z-10 flex h-full max-w-[52%] flex-col justify-between gap-8">
            <div>
              <h3 className="text-3xl font-semibold leading-[1.1] tracking-tight text-blue-950 sm:text-4xl xl:text-[2.6rem]">
                {p.lines.map((l) => (
                  <span key={l} className="block overflow-hidden pb-1">
                    <motion.span variants={riseV} className="block origin-left">
                      {l}
                    </motion.span>
                  </span>
                ))}
              </h3>
              <motion.p variants={fadeV} className="mt-4 text-sm text-slate-500 md:text-base">
                {p.sub[0]}
                <br />
                {p.sub[1]}
              </motion.p>
            </div>
            <motion.div variants={fadeV}>
              <Link to={p.to} className="group/btn inline-flex items-center gap-3 text-sm font-semibold text-blue-950">
                Learn More
                <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/40 transition duration-300 group-hover/btn:translate-x-1.5 group-hover/btn:scale-110 group-hover/btn:bg-blue-700">
                  <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* product image: parallax > entry > float > hover zoom */}
          <motion.div style={{ y }} className="absolute inset-y-4 right-2 w-[50%] md:right-4">
            <motion.div variants={picV} className="h-full w-full">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut' }}
                className="h-full w-full"
              >
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:-rotate-3 group-hover:scale-110">
                  <img src={p.img} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Showcase() {
  const sec = useRef(null)
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start end', 'end start'] })
  const blob1 = useTransform(scrollYProgress, [0, 1], [-80, 80])
  const blob2 = useTransform(scrollYProgress, [0, 1], [80, -80])

  return (
    <section ref={sec} className="relative overflow-hidden bg-[#f3f6fc] px-4 py-16 md:px-8 md:py-24">
      <motion.div style={{ y: blob1 }} className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.28),transparent_70%)] will-change-transform" />
      <motion.div style={{ y: blob2 }} className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.3),transparent_70%)] will-change-transform" />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid gap-5 md:grid-cols-2">
          {products.map((p, i) => (
            <ProductCard key={p.lines.join('')} p={p} i={i} />
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: { opacity: 0, y: 60 },
            show: { opacity: 1, y: 0, transition: { duration: 1.1, ease, staggerChildren: 0.12, delayChildren: 0.3 } },
          }}
          className="mt-5 grid grid-cols-2 gap-y-8 rounded-3xl border border-white bg-white p-6 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.15)] lg:grid-cols-4 lg:p-8"
        >
          {stats.map(({ icon: Icon, label, ...n }, k) => (
            <motion.div key={label} variants={fadeV} className={k > 0 ? 'lg:border-l lg:border-slate-200' : ''}>
              <div className="group flex cursor-default items-center gap-3 px-2 transition-transform duration-300 hover:-translate-y-1 sm:gap-4 lg:px-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-blue-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30">
                  <Icon size={30} strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-2xl font-bold text-blue-950 sm:text-3xl">
                    <Counter {...n} delay={0.5} duration={2.2} amount={0.6} />
                  </div>
                  <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
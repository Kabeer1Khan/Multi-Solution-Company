import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Building2, Factory, Home, RadioTower } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
const unsplash = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

// Swap any `img` for your own file or URL. If an image fails to load, the soft gradient shows instead.
const sectors = [
  { name: 'Residential', icon: Home, text: ['Reliable solutions', 'for your home.'], img: unsplash('photo-1564013799919-ab600027ffc6'), tint: 'from-sky-200 to-blue-400' },
  { name: 'Commercial', icon: Building2, text: ['Powering businesses', 'with confidence.'], img: unsplash('photo-1486406146926-c627a92ad1ab'), tint: 'from-sky-200 to-indigo-400' },
  { name: 'Industrial', icon: Factory, text: ['Robust solutions', 'for industry.'], img: unsplash('photo-1513828583688-c52646db42da'), tint: 'from-amber-100 to-blue-400' },
  { name: 'Infrastructure', icon: RadioTower, text: ['Building a stronger', 'future.'], img: unsplash('photo-1545558014-8692077e9b5c'), tint: 'from-sky-200 to-cyan-400' },
]
const towersImg = unsplash('photo-1473341304170-971dccb5ac1e', 1400)

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const popV = { hidden: { scale: 0, rotate: -30 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 14 } } }
const imgV = { hidden: { opacity: 0, x: 60, scale: 1.15 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.5, ease } } }
const cardV = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, delay: (i % 2) * 0.12, ease, staggerChildren: 0.1, delayChildren: 0.25 },
  }),
}
const cardCls =
  'group relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-sky-100/80 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.2)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.35)]'
const fade = 'bg-gradient-to-t from-white/80 to-transparent'

const Words = ({ text }) =>
  text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
      <motion.span variants={wordV} className="inline-block">
        {w}
      </motion.span>
    </span>
  ))

function SectorCard({ s, i }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const Icon = s.icon

  return (
    <motion.div ref={ref} custom={i} variants={cardV} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      <Link to="/contact" className={`${cardCls} block min-h-[240px] md:min-h-[300px]`}>
        {/* photo: fades into the card, drifts on scroll, zooms on hover */}
        <motion.div
          variants={imgV}
          className={`absolute inset-y-0 right-0 w-[66%] bg-gradient-to-br ${s.tint} opacity-100 [mask-image:linear-gradient(to_right,transparent,black_40%)] md:w-[62%]`}
        >
          <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
            {!failed && (
              <img
                src={s.img}
                alt={`${s.name} sector`}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            )}
          </motion.div>
        </motion.div>
        <div className={`absolute inset-x-0 bottom-0 h-1/3 ${fade}`} />
        {/* hover shine */}
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/50 opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-[550%] group-hover:opacity-100" />

        <div className="relative z-10 flex min-h-[240px] flex-col justify-between p-6 md:min-h-[300px] md:p-8">
          <motion.span variants={popV} className="w-fit">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-sky-100 text-blue-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white md:h-16 md:w-16">
              <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.8} />
            </span>
          </motion.span>
          <div className="max-w-[58%]">
            <h3 className="text-2xl font-bold tracking-tight text-blue-950 md:text-3xl">
              <Words text={s.name} />
            </h3>
            <motion.p variants={fadeV} className="mt-2 text-sm leading-snug text-slate-600 md:text-base">
              {s.text[0]}
              <br />
              {s.text[1]}
            </motion.p>
          </div>
        </div>

        <span className="absolute bottom-5 right-5 z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-blue-900 bg-white/70 text-blue-900 transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white md:h-12 md:w-12">
          <ArrowRight size={20} />
        </span>
      </Link>
    </motion.div>
  )
}

function Banner() {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-28, 28])
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div ref={ref} className="mt-5">
      <motion.div
        variants={cardV}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative min-h-[340px] overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-sky-50 to-orange-100/80 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.2)] md:min-h-[420px]"
      >
        <motion.div variants={imgV} className="absolute inset-y-0 right-0 w-full opacity-40 [mask-image:linear-gradient(to_right,transparent,black_45%)] md:w-3/5 md:opacity-100">
          <motion.div style={{ y, scale: zoom }} className="absolute -inset-y-8 inset-x-0 will-change-transform">
            {!failed && (
              <img src={towersImg} alt="Power transmission towers at sunset" loading="lazy" decoding="async" onError={() => setFailed(true)} className="h-full w-full object-cover" />
            )}
          </motion.div>
        </motion.div>

        <div className="relative z-10 flex min-h-[340px] max-w-2xl flex-col justify-center p-7 sm:p-10 md:min-h-[420px] md:p-14">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
            <Words text="Let’s Build a Smarter Tomorrow Together" />
          </h2>
          <motion.p variants={fadeV} className="mt-4 text-base text-blue-950/80 md:text-lg">
            Get expert solutions for your projects.
          </motion.p>
          <motion.div variants={fadeV}>
            <Link
              to="/contact"
              className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-800 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/50"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[600%]" />
              <span className="relative">Contact Us</span>
              <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Sectors() {
  return (
    <section className="bg-[#f3f6fc] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-5 md:grid-cols-2">
          {sectors.map((s, i) => (
            <SectorCard key={s.name} s={s} i={i} />
          ))}
        </div>
        <Banner />
      </div>
    </section>
  )
}
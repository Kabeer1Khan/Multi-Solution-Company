import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
const unsplash = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`
const local = (path) => new URL(path, import.meta.url).href

// Each image tries its sources in order (internet photo first, then your own project image if it fails).
const cards = [
  { name: 'Residential', tint: 'from-sky-400 to-blue-700', imgs: [unsplash('photo-1564013799919-ab600027ffc6'), local('../assets/home_page/hero.webp')] },
  { name: 'Commercial', tint: 'from-blue-400 to-indigo-700', imgs: [unsplash('photo-1486406146926-c627a92ad1ab'), local('../assets/about_page/Twilight Reflections at Multi-Solution Company.webp')] },
  { name: 'Industrial', tint: 'from-amber-300 to-blue-800', imgs: [unsplash('photo-1513828583688-c52646db42da'), local('../assets/industries/Twilight Refinery Reflections.webp')] },
  { name: 'Infrastructure', tint: 'from-sky-300 to-cyan-600', imgs: [unsplash('photo-1545558014-8692077e9b5c')] },
  { name: 'Renewable Energy Solutions', tint: 'from-sky-300 to-emerald-500', imgs: [unsplash('photo-1532601224476-15c79f2f7a51')] },
  { name: 'Clean Energy & Utilities', tint: 'from-blue-300 to-blue-700', imgs: [unsplash('photo-1480714378408-67cf0d13bc1b')] },
]
const bannerImgs = [unsplash('photo-1480714378408-67cf0d13bc1b', 1400), local('../assets/solution-page/Futuristic Cityscape Reflected at Night.webp')]

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const popV = { hidden: { scale: 0, rotate: -30 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 14 } } }
const imgV = { hidden: { scale: 1.25 }, show: { scale: 1, transition: { duration: 1.8, ease } } }
const bannerImgV = { hidden: { opacity: 0, x: 60, scale: 1.12 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.5, ease } } }
const cardV = {
  hidden: { opacity: 0, y: 80, scale: 0.96 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.1, delay: (i % 3) * 0.12, ease, staggerChildren: 0.12, delayChildren: 0.3 },
  }),
}

const Words = ({ text }) =>
  text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
      <motion.span variants={wordV} className="inline-block">{w}</motion.span>
    </span>
  ))

function Photo({ srcs, alt, className }) {
  const [i, setI] = useState(0)
  if (i >= srcs.length) return null
  return <img src={srcs[i]} alt={alt} loading="lazy" decoding="async" onError={() => setI(i + 1)} className={className} />
}

function Card({ c, i }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])

  return (
    <motion.div ref={ref} custom={i} variants={cardV} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
      <Link
        to="/solution"
        className={`group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br ${c.tint} shadow-xl shadow-blue-950/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/30 sm:aspect-square`}
      >
        <motion.div style={{ y }} className="absolute -inset-[8%] will-change-transform">
          <motion.div variants={imgV} className="h-full w-full">
            <Photo srcs={c.imgs} alt={`${c.name} sector`} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#06143a] via-[#06143a]/75 to-transparent transition-colors duration-500 group-hover:from-blue-900" />
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-[550%] group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 md:p-6">
          <motion.h3 variants={fadeV} className="max-w-[70%] text-xl font-semibold leading-tight text-white transition-transform duration-500 group-hover:-translate-y-1 md:text-2xl">
            {c.name}
          </motion.h3>
          <motion.span variants={popV} className="shrink-0">
            <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-white/80 text-white transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-blue-700">
              <ArrowRight size={20} />
            </span>
          </motion.span>
        </div>
      </Link>
    </motion.div>
  )
}

function Banner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-28, 28])
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div ref={ref} className="mt-5 md:mt-8">
      <motion.div
        variants={cardV}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="relative min-h-[340px] overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-sky-100 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.2)] md:min-h-[400px]"
      >
        <motion.div variants={bannerImgV} className="absolute inset-y-0 right-0 w-full opacity-40 [mask-image:linear-gradient(to_right,transparent,black_45%)] md:w-3/5 md:opacity-100">
          <motion.div style={{ y, scale: zoom }} className="absolute -inset-y-8 inset-x-0 will-change-transform">
            <Photo srcs={bannerImgs} alt="City skyline lit at dusk" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>

        <div className="relative z-10 flex min-h-[340px] max-w-xl flex-col justify-center p-7 sm:p-10 md:min-h-[400px] md:p-14">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
            <Words text="Powering Progress Across Industries" />
          </h2>
          <motion.p variants={fadeV} className="mt-4 text-base text-blue-950/80 md:text-lg">
            From homes to industries, we deliver reliable and innovative solutions everywhere.
          </motion.p>
          <motion.div variants={fadeV}>
            <Link
              to="/contact"
              className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-800 to-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-700/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/50"
            >
              <span className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[600%]" />
              <span className="relative">Explore More</span>
              <ArrowRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function IndustryGrid() {
  return (
    <section className="bg-[#f3f6fc] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {cards.map((c, i) => (
            <Card key={c.name} c={c} i={i} />
          ))}
        </div>
        <Banner />
      </div>
    </section>
  )
}
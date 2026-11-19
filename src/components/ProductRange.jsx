import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Flame, ShieldCheck, Sparkles, Timer, ToggleRight, Zap } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
const unsplash = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

// Each image tries its sources in order and uses the next one if a link fails.
// To use an internet photo for cables/switches, put its URL at the FRONT of that list.
const cableImgs = [new URL('../assets/home_page/Glossy Colourful Cable Coils.webp', import.meta.url).href]
const switchImgs = [new URL('../assets/home_page/Glossy Three-Switch Wall Panel.webp', import.meta.url).href]
const bannerImgs = [
  unsplash('photo-1486406146926-c627a92ad1ab'),
  new URL('../assets/about_page/Twilight Reflections at Multi-Solution Company.webp', import.meta.url).href,
]

const tabs = [
  { id: 'zinc-cables', label: 'Zinc Cables' },
  { id: 'zinc-switches', label: 'Zinc Switches' },
]
const products = [
  {
    id: 'zinc-cables', title: 'Zinc Cables', text: 'High-performance cables for reliable and safe connectivity.', cta: 'Explore Cables', imgs: cableImgs,
    features: [{ icon: Zap, label: 'High Conductivity' }, { icon: Flame, label: 'Fire Resistant' }, { icon: Timer, label: 'Long Life' }],
  },
  {
    id: 'zinc-switches', title: 'Zinc Switches', text: 'Smart switches for modern living.', cta: 'Explore Switches', imgs: switchImgs,
    features: [{ icon: Sparkles, label: 'Elegant Design' }, { icon: ShieldCheck, label: 'Enhanced Safety' }, { icon: ToggleRight, label: 'Smart Control' }],
  },
]

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const popV = { hidden: { scale: 0, rotate: -30 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 14 } } }
const imgV = { hidden: { opacity: 0, x: 60, scale: 1.12 }, show: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.5, ease } } }
const cardV = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease, staggerChildren: 0.12, delayChildren: 0.25 } },
}
const cardCls = 'group relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-sky-100/80 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.2)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.35)]'
const vp = { once: true, amount: 0.25 }

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

function PillButton({ children, to = '/contact' }) {
  return (
    <Link to={to} className="group/btn relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-700 to-blue-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50">
      <span className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover/btn:translate-x-[600%]" />
      <span className="relative">{children}</span>
      <ArrowRight size={16} className="relative transition-transform duration-300 group-hover/btn:translate-x-1.5" />
    </Link>
  )
}

function ProductBlock({ p, onActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' }) // scroll-spy for the tabs
  useEffect(() => {
    if (inView) onActive(p.id)
  }, [inView, onActive, p.id])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <div id={p.id} ref={ref} className="scroll-mt-28">
      <motion.div variants={cardV} initial="hidden" whileInView="show" viewport={vp} className={`${cardCls} grid md:grid-cols-2`}>
        <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 md:p-14">
          <h3 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl"><Words text={p.title} /></h3>
          <motion.p variants={fadeV} className="mt-3 max-w-sm text-base text-slate-600 md:text-lg">{p.text}</motion.p>
          <motion.div variants={fadeV}><PillButton>{p.cta}</PillButton></motion.div>
        </div>
        <motion.div variants={imgV} className="relative min-h-[240px] [mask-image:linear-gradient(to_right,transparent,black_30%)] md:min-h-[340px]">
          <motion.div style={{ y }} className="absolute -inset-y-[6%] inset-x-0 p-4 will-change-transform md:p-8">
            <Photo srcs={p.imgs} alt={p.title} className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-110" />
          </motion.div>
        </motion.div>
        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/50 opacity-0 transition-all duration-1000 ease-out group-hover:translate-x-[550%] group-hover:opacity-100" />
      </motion.div>

      {/* feature strip */}
      <motion.div variants={cardV} initial="hidden" whileInView="show" viewport={vp} className="mt-4 grid grid-cols-3 rounded-3xl border border-white bg-white/80 p-2 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.15)] sm:p-3">
        {p.features.map(({ icon: Icon, label }, k) => (
          <motion.div key={label} variants={fadeV} className={k > 0 ? 'border-l border-slate-200' : ''}>
            <div className="group flex cursor-default flex-col items-center gap-2 px-2 py-4 text-center transition-transform duration-300 hover:-translate-y-1.5">
              <motion.span variants={popV}>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/30">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
              </motion.span>
              <span className="text-xs font-semibold text-blue-950 transition-colors duration-300 group-hover:text-blue-600 sm:text-sm">{label}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function Banner() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-28, 28])
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div ref={ref} className="mt-16">
      <motion.div variants={cardV} initial="hidden" whileInView="show" viewport={vp} className="relative min-h-[300px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#050f2c] via-[#0a1f52] to-[#0e3a8a] shadow-2xl shadow-blue-950/30 md:min-h-[360px]">
        <motion.div variants={imgV} className="absolute inset-y-0 right-0 w-full opacity-40 [mask-image:linear-gradient(to_right,transparent,black_45%)] md:w-3/5 md:opacity-100">
          <motion.div style={{ y, scale: zoom }} className="absolute -inset-y-8 inset-x-0 will-change-transform">
            <Photo srcs={bannerImgs} alt="Multi Solution Company building" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>
        <div className="relative z-10 flex min-h-[300px] max-w-xl flex-col justify-center p-7 sm:p-10 md:min-h-[360px] md:p-14">
          <h3 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"><Words text="Explore Our Complete Range" /></h3>
          <motion.p variants={fadeV} className="mt-3 text-base text-blue-100/80 md:text-lg">Discover more innovative solutions from our team.</motion.p>
          <motion.div variants={fadeV}><PillButton>Talk to Us</PillButton></motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProductRange() {
  const [active, setActive] = useState('zinc-cables')

  return (
    <section className="bg-[#f3f6fc] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        {/* tabs: click to scroll, highlight follows your scroll position */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="mx-auto mb-10 flex w-fit gap-1 rounded-full bg-white p-1.5 shadow-[0_10px_30px_-10px_rgba(30,64,175,0.25)]"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 hover:text-blue-600 sm:px-8"
            >
              {active === t.id && (
                <motion.span layoutId="range-tab" transition={{ type: 'spring', stiffness: 380, damping: 30 }} className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-600/30" />
              )}
              <span className={`relative ${active === t.id ? 'text-white' : 'text-slate-600'}`}>{t.label}</span>
            </button>
          ))}
        </motion.div>

        <div className="space-y-14 md:space-y-20">
          {products.map((p) => (
            <ProductBlock key={p.id} p={p} onActive={setActive} />
          ))}
        </div>
        <Banner />
      </div>
    </section>
  )
}
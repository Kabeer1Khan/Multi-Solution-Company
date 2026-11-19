import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Briefcase, ChevronRight, Construction, Factory, Home } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
const view = { once: true, amount: 0.3 }
const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=75`

// Swap any `img` below for your own file or URL. If an image fails to load, the gradient shows instead.
const industries = [
  { name: 'Residential', icon: Home, img: unsplash('photo-1564013799919-ab600027ffc6'), tint: 'from-sky-500 to-blue-800' },
  { name: 'Commercial', icon: Briefcase, img: unsplash('photo-1486406146926-c627a92ad1ab'), tint: 'from-blue-500 to-indigo-800' },
  { name: 'Industrial', icon: Factory, img: unsplash('photo-1513828583688-c52646db42da'), tint: 'from-slate-500 to-blue-900' },
  { name: 'Infrastructure', icon: Construction, img: unsplash('photo-1545558014-8692077e9b5c'), tint: 'from-cyan-500 to-blue-900' },
]
const ctaImg = unsplash('photo-1480714378408-67cf0d13bc1b')

const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const stagger = (s = 0.08, d = 0) => ({ hidden: {}, show: { transition: { staggerChildren: s, delayChildren: d } } })

const Words = ({ text }) =>
  text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
      <motion.span variants={wordV} className="inline-block">
        {w}
      </motion.span>
    </span>
  ))

function IndustryCard({ it, i }) {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%'])
  const Icon = it.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay: i * 0.12, ease }}
    >
      <Link
        to="/industries"
        className={`group relative block aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br ${it.tint} shadow-xl shadow-blue-950/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/30 md:aspect-[5/4]`}
      >
        {/* image: parallax + zoom-out on entry + zoom-in on hover */}
        <motion.div style={{ y }} className="absolute -inset-[8%]">
          {!failed && (
            <motion.img
              src={it.img}
              alt={`${it.name} sector`}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              initial={{ scale: 1.3 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay: i * 0.12, ease }}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/15 to-transparent transition-colors duration-500 group-hover:from-blue-900/95" />

        {/* curtain that wipes away on entry */}
        <motion.span
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.12 + 0.15, ease }}
          className="absolute inset-0 z-20 origin-top bg-blue-700"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 sm:p-5">
          <span className="flex items-center gap-3 text-base font-semibold text-white transition-transform duration-500 group-hover:-translate-y-1 sm:text-lg">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            {it.name}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-blue-950/90 text-white transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110 group-hover:bg-blue-500">
            <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Industries() {
  const banner = useRef(null)
  const [ctaFailed, setCtaFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: banner, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [-24, 24])
  const waveX = useTransform(scrollYProgress, [0, 1], [-60, 60])

  return (
    <section className="bg-[#f3f6fc] px-4 pb-16 pt-4 md:px-8 md:pb-24">
      <div className="mx-auto max-w-[1400px]">
        {/* Heading */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div initial="hidden" whileInView="show" viewport={view} variants={stagger(0.08)}>
            <div className="flex items-center gap-3">
              <motion.span
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease } } }}
                className="h-[3px] w-14 origin-left rounded bg-blue-600"
              />
              <motion.span variants={fadeV} className="text-sm font-semibold text-blue-600 md:text-base">
                Our Industries
              </motion.span>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
              <Words text="Trusted Across Multiple Sectors" />
            </h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={view} variants={stagger(0.1, 0.4)} className="flex gap-4 md:max-w-xs">
            <motion.span
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1, ease } } }}
              className="w-[3px] origin-top self-stretch rounded bg-blue-600"
            />
            <motion.p variants={fadeV} className="text-sm text-slate-500 md:text-base">
              Delivering reliable electrical solutions for a wide range of industries.
            </motion.p>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 md:mt-10">
          {industries.map((it, i) => (
            <IndustryCard key={it.name} it={it} i={i} />
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          ref={banner}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease }}
          className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#050f2c] via-blue-950 to-blue-700 shadow-2xl shadow-blue-900/30 md:mt-14"
        >
          {!ctaFailed && (
            <motion.div style={{ y: imgY }} className="absolute -inset-y-6 right-0 w-full md:w-3/5">
              <img
                src={ctaImg}
                alt=""
                loading="lazy"
              decoding="async"
                onError={() => setCtaFailed(true)}
                className="h-full w-full object-cover opacity-40 [mask-image:linear-gradient(to_right,transparent,black_55%)] md:opacity-90"
              />
            </motion.div>
          )}
          <motion.svg style={{ x: waveX }} className="pointer-events-none absolute -inset-x-16 inset-y-0 h-full w-[calc(100%+8rem)]" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <path d="M0 300 C 350 270, 650 130, 1200 50 L1200 300 Z" fill="rgba(59,130,246,0.14)" />
            <motion.path
              d="M0 290 C 360 265, 660 125, 1200 45"
              stroke="#60a5fa"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.4, delay: 0.4, ease }}
            />
          </motion.svg>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={stagger(0.1, 0.3)}
            className="relative z-10 max-w-xl p-7 sm:p-10 md:p-14"
          >
            <h3 className="text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
              <Words text="Ready to Power a Smarter" />
              <span className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span variants={wordV} className="inline-block text-blue-400">
                  Tomorrow?
                </motion.span>
              </span>
            </h3>
            <motion.p variants={fadeV} className="mt-3 text-sm text-blue-100/80 md:text-base">
              Let&rsquo;s bring your vision to life with our smart solutions.
            </motion.p>
            <motion.div variants={fadeV}>
              <Link
                to="/contact"
                className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-blue-500/60"
              >
                <span className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[600%]" />
                <span className="relative">Get in Touch</span>
                <ChevronRight size={18} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
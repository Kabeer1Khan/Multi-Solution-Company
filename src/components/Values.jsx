import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { BadgeCheck, Check, Leaf, Lightbulb } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
// Swap for your own photo any time. If it fails to load, the blue gradient shows instead.
const photo = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=75'

const values = [
  { icon: Lightbulb, title: 'Innovation', text: 'Always Ahead' },
  { icon: BadgeCheck, title: 'Quality', text: 'Without Compromise' },
  { icon: Leaf, title: 'Sustainability', text: 'For a Greener Tomorrow' },
]
const reasons = ['Trusted Quality & Performance', 'Innovative Solutions', 'Global Presence', 'Customer-Centric Approach']

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const cardV = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease, staggerChildren: 0.12, delayChildren: 0.25 } },
}
const cardCls =
  'rounded-3xl border border-white bg-gradient-to-br from-white to-blue-50/70 p-6 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.18)] sm:p-8 md:p-10'

const Words = ({ text }) =>
  text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
      <motion.span variants={wordV} className="inline-block">
        {w}
      </motion.span>
    </span>
  ))

function PhotoCard() {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.1, delay: 0.15, ease }}
      className="group relative min-h-[300px] overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-blue-800 shadow-xl shadow-blue-950/15 lg:min-h-0"
    >
      {!failed && (
        <motion.div style={{ y }} className="absolute -inset-[8%] will-change-transform">
          <motion.img
            src={photo}
            alt="Two engineers reviewing a blueprint on site"
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            initial={{ scale: 1.25 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay: 0.15, ease }}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </motion.div>
      )}
      {/* curtain that wipes away on entry */}
      <motion.span
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.3, ease }}
        className="absolute inset-0 z-10 origin-right bg-blue-700"
      />
    </motion.div>
  )
}

export default function Values() {
  const sec = useRef(null)
  const { scrollYProgress } = useScroll({ target: sec, offset: ['start end', 'end start'] })
  const blob1 = useTransform(scrollYProgress, [0, 1], [-70, 70])
  const blob2 = useTransform(scrollYProgress, [0, 1], [70, -70])
  const vp = { once: true, amount: 0.25 }

  return (
    <section ref={sec} className="relative overflow-hidden bg-[#f3f6fc] px-4 py-16 md:px-8 md:py-24">
      <motion.div style={{ y: blob1 }} className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.28),transparent_70%)] will-change-transform" />
      <motion.div style={{ y: blob2 }} className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.3),transparent_70%)] will-change-transform" />

      <div className="relative mx-auto max-w-[1400px]">
        {/* Our Values */}
        <motion.div variants={cardV} initial="hidden" whileInView="show" viewport={vp} className={cardCls}>
          <h2 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
            <Words text="Our Values" />
          </h2>
          <p className="mt-1 text-xl text-blue-950/80 sm:text-2xl">
            <Words text="Guiding Our Growth" />
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-0">
            {values.map(({ icon: Icon, title, text }, k) => (
              <motion.div key={title} variants={fadeV} className="relative">
                {k > 0 && (
                  <motion.span
                    variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1, ease } } }}
                    className="absolute left-0 top-0 hidden h-full w-px origin-top bg-slate-200 md:block"
                  />
                )}
                <div className="group flex cursor-default flex-col items-center px-4 text-center transition-transform duration-300 hover:-translate-y-1.5">
                  <motion.span
                    variants={{
                      hidden: { scale: 0, rotate: -30 },
                      show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 14, delay: 0.4 + k * 0.12 } },
                    }}
                  >
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-blue-700 shadow-lg shadow-blue-600/10 ring-1 ring-blue-100 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-600/40">
                      <Icon size={26} strokeWidth={1.8} />
                    </span>
                  </motion.span>
                  <h3 className="mt-4 text-base font-semibold text-blue-950 transition-colors duration-300 group-hover:text-blue-600">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us + photo */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <motion.div variants={cardV} initial="hidden" whileInView="show" viewport={vp} className={cardCls}>
            <h3 className="text-2xl font-bold tracking-tight text-blue-950 sm:text-3xl">
              <Words text="Why Choose Us?" />
            </h3>
            <ul className="mt-7 space-y-5">
              {reasons.map((r) => (
                <motion.li
                  key={r}
                  variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.9, ease } } }}
                >
                  <div className="group flex cursor-default items-center gap-4 transition-transform duration-300 hover:translate-x-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-900 text-white transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-500 group-hover:shadow-lg group-hover:shadow-blue-500/40">
                      <Check size={15} strokeWidth={3} />
                    </span>
                    <span className="text-base font-medium text-blue-950/90 transition-colors duration-300 group-hover:text-blue-600 sm:text-lg">{r}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <PhotoCard />
        </div>
      </div>
    </section>
  )
}
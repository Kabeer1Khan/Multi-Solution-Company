import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { Flag, Globe, Rocket, Zap } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
// Swap for your own photo any time. If it fails to load, the navy card still looks fine without it.
const skyline = 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=75'

// Edit years / titles here
const steps = [
  { year: '2000', icon: Flag, title: ['Our Journey', 'Begins'] },
  { year: '2006', icon: Globe, title: ['Expanding', 'Horizons'] },
  { year: '2015', icon: Zap, title: ['Driving', 'Innovation'] },
  { year: '2026', icon: Rocket, title: ['Shaping a', 'Smarter Future'] },
]

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const popV = {
  hidden: { scale: 0, rotate: -30 },
  show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 14 } },
}
const cardV = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease, staggerChildren: 0.14, delayChildren: 0.25 } },
}

const Words = ({ text }) =>
  text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom">
      <motion.span variants={wordV} className="inline-block">
        {w}
      </motion.span>
    </span>
  ))

export default function Journey() {
  const card = useRef(null)
  const [failed, setFailed] = useState(false)
  const [reached, setReached] = useState(1) // how many milestones are lit

  // Scroll behaviour: the line fills as you scroll and lights up each milestone
  const { scrollYProgress } = useScroll({ target: card, offset: ['start 85%', 'end 55%'] })
  const fill = useTransform(scrollYProgress, [0.1, 0.9], [0, 1])
  const imgY = useTransform(scrollYProgress, [0, 1], [-24, 24])
  useMotionValueEvent(fill, 'change', (v) => setReached(Math.min(4, Math.floor(v * 3 + 0.02) + 1)))

  return (
    <section className="bg-[#f3f6fc] px-4 pb-16 md:px-8 md:pb-24">
      <div ref={card} className="mx-auto max-w-[1400px]">
        <motion.div
          variants={cardV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#050f2c] via-[#0a1f52] to-[#0e3a8a] p-6 shadow-2xl shadow-blue-950/30 sm:p-8 md:p-12"
        >
          {/* skyline, fades into the navy card */}
          {!failed && (
            <motion.div style={{ y: imgY }} className="absolute -inset-y-6 right-0 w-full will-change-transform md:w-3/5">
              <img
                src={skyline}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover opacity-40 [mask-image:linear-gradient(to_right,transparent,black_50%)] md:opacity-90"
              />
            </motion.div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#050f2c] via-[#050f2c]/70 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              <Words text="Our Journey" />
            </h2>
            <p className="mt-1 text-xl font-light text-white/90 sm:text-2xl">
              <Words text="A Legacy of Excellence" />
            </p>

            <ol className="relative mt-14 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-0">
              {/* horizontal line (desktop): dim track + scroll-filled line */}
              <motion.span
                variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, delay: 0.5, ease } } }}
                className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px origin-left bg-white/20 md:block"
              />
              <motion.span
                style={{ scaleX: fill }}
                className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[2px] origin-left bg-gradient-to-r from-blue-400 to-sky-300 md:block"
              />
              {/* vertical line (mobile) */}
              <span className="absolute bottom-8 left-8 top-8 w-px bg-white/20 md:hidden" />
              <motion.span style={{ scaleY: fill }} className="absolute bottom-8 left-8 top-8 w-[2px] origin-top bg-gradient-to-b from-blue-400 to-sky-300 md:hidden" />

              {/* pulsing dots between milestones */}
              {[25, 50, 75].map((p) => (
                <motion.span
                  key={p}
                  variants={popV}
                  style={{ left: `${p}%` }}
                  className="absolute top-8 hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 md:block"
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/60" />
                  <span className="absolute inset-0 rounded-full bg-blue-400" />
                </motion.span>
              ))}

              {steps.map(({ year, icon: Icon, title }, i) => {
                const on = i < reached
                return (
                  <motion.li key={year} variants={fadeV} className="relative">
                    <div className="group flex cursor-default items-center gap-5 transition-transform duration-300 hover:-translate-y-1.5 md:flex-col md:gap-0 md:text-center">
                      <motion.span variants={popV} className="relative grid h-16 w-16 shrink-0 place-items-center">
                        <span
                          className={`absolute inset-0 rounded-full border border-dashed transition-colors duration-500 ${
                            on ? 'animate-[spin_14s_linear_infinite] border-blue-300' : 'border-white/20'
                          }`}
                        />
                        <span
                          className={`grid h-12 w-12 place-items-center rounded-full border transition-all duration-500 group-hover:scale-110 ${
                            on
                              ? 'border-blue-400 bg-blue-500/30 text-white shadow-[0_0_24px_rgba(59,130,246,0.55)]'
                              : 'border-white/20 bg-white/5 text-white/60'
                          }`}
                        >
                          <Icon size={20} />
                        </span>
                      </motion.span>
                      <div className="md:mt-5">
                        <p className={`text-2xl font-semibold transition-colors duration-500 group-hover:text-blue-300 ${on ? 'text-white' : 'text-white/50'}`}>{year}</p>
                        <p className="mt-1 text-sm leading-snug text-blue-100/70">
                          {title[0]}
                          <br />
                          {title[1]}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                )
              })}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
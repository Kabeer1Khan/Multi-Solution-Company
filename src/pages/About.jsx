import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import WhoWeAre from '../components/WhoWeAre'
import Values from '../components/Values'
import Journey from '../components/Journey'

// new URL(...) keeps the page alive even if the file name is mistyped (the dark gradient shows instead)
const bg = new URL('../assets/about_page/Twilight Reflections at Multi-Solution Company.webp', import.meta.url).href

const ease = [0.16, 1, 0.3, 1]

// Big title: every letter rises from behind a mask
function Letters({ text, delay = 0 }) {
  const words = text.split(' ')
  return words.map((w, wi) => (
    <span key={wi} className="inline-flex whitespace-nowrap" style={{ marginRight: wi < words.length - 1 ? '0.28em' : 0 }}>
      {w.split('').map((c, k) => (
        <span key={k} className="inline-block overflow-hidden pb-2">
          <motion.span
            initial={{ y: '115%', rotate: 8 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1.1, delay: delay + (wi * 6 + k) * 0.05, ease }}
            className="inline-block"
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  ))
}

// Subtitle: words rise from behind a mask
function Words({ text, delay = 0 }) {
  return text.split(' ').map((w, k) => (
    <span key={k} className="mr-[0.25em] inline-block overflow-hidden pb-1.5 align-bottom">
      <motion.span
        initial={{ y: '115%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay: delay + k * 0.12, ease }}
        className="inline-block"
      >
        {w}
      </motion.span>
    </span>
  ))
}

export default function About() {
  const ref = useRef(null)

  // Scroll behaviour: frame shrinks, image drifts + zooms, text lifts and fades
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const imgZoom = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0])

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
    <>
    <section ref={ref} className="relative p-1.5 md:p-2">
      <motion.div style={{ scale: frameScale, transformOrigin: '50% 0%' }}>
        {/* Frame opens up from the centre */}
        <motion.div
          onMouseMove={onMove}
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.6, ease }}
          className="relative isolate h-[calc(100svh-0.75rem)] min-h-[620px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#06143a] to-[#0b2a6b] md:h-[calc(100svh-1rem)]"
        >
          {/* Background image: un-blurs and settles */}
          <motion.div style={{ y: imgY, scale: imgZoom }} className="absolute inset-0 will-change-transform">
            <motion.img
              src={bg}
              alt="Multi Solution Company headquarters at twilight"
              style={{ x: px, y: py }}
              initial={{ scale: 1.3, opacity: 0.3 }}
              animate={{ scale: 1.05, opacity: 1 }}
              transition={{ duration: 2.6, ease }}
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover object-[72%_50%] md:object-center"
            />
          </motion.div>

          {/* Light overlays: just enough for readable text */}
          <div className="absolute inset-y-0 left-0 w-[65%] bg-gradient-to-r from-[#040a1c]/55 via-[#040a1c]/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#040a1c]/45 to-transparent" />

          {/* Content */}
          <motion.div
            style={{ y: textY, opacity: fade }}
            className="absolute inset-0 flex flex-col justify-center px-5 pt-20 sm:px-8 md:px-14 md:pt-28 lg:px-16"
          >
            <h1 className="text-[3.2rem] font-bold leading-none tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              <Letters text="About Us" delay={0.9} />
            </h1>
            <p className="mt-3 text-xl font-light text-white sm:text-2xl md:text-3xl lg:text-4xl">
              <Words text="Powering a Better Tomorrow" delay={1.5} />
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 2.1, ease }}
              className="mt-8 sm:mt-10"
            >
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
        </motion.div>
      </motion.div>
    </section>
    <WhoWeAre />
    <Values />
    <Journey />
    </>
  )
}
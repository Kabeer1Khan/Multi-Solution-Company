import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ContactSection from '../components/ContactSection'

// Note the folder name: contact_page (with an underscore). new URL(...) keeps the page alive if the file name
// is mistyped (the dark blue gradient shows instead of the photo).
const bg = new URL('../assets/contact_page/Twilight glass corporate building.webp', import.meta.url).href

const ease = [0.16, 1, 0.3, 1]
const title = [{ text: 'Contact' }, { text: 'Us', accent: true }]

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease },
})

export default function Contact() {
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

  let n = 0 // running letter index, so letters rise one after another across both words

  return (
    <>
    <section ref={ref} className="relative p-1.5 md:p-2">
      <motion.div style={{ scale: frameScale, transformOrigin: '50% 0%' }}>
        <motion.div
          onMouseMove={onMove}
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.6, ease }}
          className="relative isolate h-[calc(100svh-0.75rem)] min-h-[620px] overflow-hidden rounded-3xl bg-gradient-to-b from-[#06143a] to-[#0b2a6b] md:h-[calc(100svh-1rem)]"
        >
          {/* Background image: settles in */}
          <motion.div style={{ y: imgY, scale: imgZoom }} className="absolute inset-0 will-change-transform">
            <motion.img
              src={bg}
              alt="Glass corporate building lit up at twilight"
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
          <div className="absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-[#040a1c]/55 via-[#040a1c]/20 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#040a1c]/45 to-transparent" />

          {/* Content */}
          <motion.div
            style={{ y: textY, opacity: fade }}
            className="absolute inset-0 flex flex-col justify-center px-4 pt-20 sm:px-6 md:px-12 md:pt-28"
          >
            <h1 className="text-[3.2rem] font-bold leading-none tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-7xl xl:text-[5.5rem]">
              {title.map(({ text, accent }) => (
                <span key={text} className="mr-[0.28em] inline-flex whitespace-nowrap">
                  {text.split('').map((c, k) => (
                    <span key={k} className="inline-block overflow-hidden pb-2">
                      <motion.span
                        initial={{ y: '115%', rotate: 8 }}
                        animate={{ y: 0, rotate: 0 }}
                        transition={{ duration: 1.1, delay: 0.9 + n++ * 0.06, ease }}
                        className={`inline-block ${accent ? 'text-[#17a6ff]' : ''}`}
                      >
                        {c}
                      </motion.span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>

            <motion.p {...fadeUp(1.7)} className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-white/90 sm:mt-5 md:text-xl xl:text-2xl">
              We’d love to hear from you. Get in touch with us for any inquiries, support or collaboration.
            </motion.p>

            <motion.div {...fadeUp(2.1)} className="mt-6 sm:mt-8">
              {/* scrolls to just below this hero, so it works once you add a contact form */}
              <button
                onClick={() => window.scrollTo({ top: ref.current.offsetHeight, behavior: 'smooth' })}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-white px-6 py-4 text-sm font-semibold text-slate-900 shadow-xl transition-transform duration-300 hover:-translate-y-1 sm:text-base"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-blue-700 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative transition-colors duration-300 group-hover:text-white">Get In Touch</span>
                <span className="relative grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-blue-700">
                  <ArrowRight size={15} />
                </span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
    <ContactSection />
    </>
  )
}
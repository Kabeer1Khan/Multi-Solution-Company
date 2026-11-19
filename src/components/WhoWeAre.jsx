import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]
// Swap for your own photo any time. If it fails to load, the blue gradient shows instead.
const photo = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=75'

// transform + opacity only, so scrolling stays smooth
const wordV = { hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease } } }
const fadeV = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const cardV = {
  hidden: { opacity: 0, y: 60, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease, staggerChildren: 0.14, delayChildren: 0.25 } },
}

export default function WhoWeAre() {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const frameX = useTransform(scrollYProgress, [0, 1], [14, -14])
  const frameY = useTransform(scrollYProgress, [0, 1], [-14, 14])
  const textY = useTransform(scrollYProgress, [0, 1], [24, -24])

  return (
    <section ref={ref} className="bg-[#f3f6fc] px-4 pt-16 md:px-8 md:pt-24">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          variants={cardV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid items-center gap-8 rounded-3xl border border-white bg-gradient-to-br from-white to-blue-50/70 p-6 shadow-[0_10px_40px_-12px_rgba(30,64,175,0.18)] sm:p-8 md:grid-cols-2 md:gap-14 md:p-10 lg:p-12"
        >
          {/* Text */}
          <motion.div style={{ y: textY }}>
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl lg:text-5xl">
              {['Who', 'We', 'Are'].map((w) => (
                <span key={w} className="mr-[0.25em] inline-block overflow-hidden pb-1.5 align-bottom">
                  <motion.span variants={wordV} className="inline-block">
                    {w}
                  </motion.span>
                </span>
              ))}
            </h2>

            <motion.p variants={fadeV} className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              We are a leading multi-solution company, specializing in high-quality cables and switches.
            </motion.p>
            <motion.p variants={fadeV} className="mt-3 max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              With a commitment to innovation, safety and customer satisfaction, we continue to build a more connected and sustainable future.
            </motion.p>

            <motion.div variants={fadeV}>
              <Link
                to="/solution"
                className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50"
              >
                <span className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 transition-transform duration-700 group-hover:translate-x-[600%]" />
                <span className="relative">Learn More</span>
                <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: 60 }, show: { opacity: 1, x: 0, transition: { duration: 1.2, ease } } }}
            className="relative"
          >
            {/* offset outline that drifts the opposite way while you scroll */}
            <motion.span
              style={{ x: frameX, y: frameY }}
              className="pointer-events-none absolute -inset-3 hidden rounded-[2rem] border border-blue-300/60 sm:block"
            />
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 to-blue-800 shadow-xl shadow-blue-950/15">
              {!failed && (
                <motion.div style={{ y: imgY }} className="absolute -inset-[8%] will-change-transform">
                  <motion.img
                    src={photo}
                    alt="Glass office towers at dusk"
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailed(true)}
                    variants={{ hidden: { scale: 1.25 }, show: { scale: 1, transition: { duration: 1.8, delay: 0.3, ease } } }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </motion.div>
              )}
              {/* curtain that wipes away on entry */}
              <motion.span
                variants={{ hidden: { scaleX: 1 }, show: { scaleX: 0, transition: { duration: 1.1, delay: 0.5, ease } } }}
                className="absolute inset-0 z-10 origin-left bg-blue-700"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
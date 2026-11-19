import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Showcase from './components/Showcase'
import Industries from './components/Industries'
import Footer from './components/Footer'
import About from './pages/About'
import Solution from './pages/Solution'
import Products from './pages/Products'
import IndustriesPage from './pages/IndustriesPage'
import Contact from './pages/Contact'

const Home = () => (
  <>
    <Hero />
    <Showcase />
    <Industries />
    {/* Add your next sections here */}
  </>
)

// Placeholder for every other page – replace each with your real page later
const Page = ({ title }) => (
  <section className="mx-auto min-h-screen max-w-5xl px-6 pt-44">
    <h1 className="text-5xl font-semibold capitalize text-blue-950">{title}</h1>
    <p className="mt-4 text-slate-500">This page is ready for your content.</p>
  </section>
)

const pages = ['tracking']

export default function App() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <MotionConfig reducedMotion="user">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/solution" element={<Solution />} />
            <Route path="/products" element={<Products />} />
            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/contact" element={<Contact />} />
            {pages.map((p) => (
              <Route key={p} path={`/${p}`} element={<Page title={p} />} />
            ))}
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  )
}
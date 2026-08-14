import { Nav } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { MobileActionBar } from './components/layout/MobileActionBar'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Stats } from './components/sections/Stats'
import { Services } from './components/sections/Services'
import { Faq } from './components/sections/Faq'
import { Clients } from './components/sections/Clients'
import { CtaBand } from './components/sections/CtaBand'
import { Contact } from './components/sections/Contact'

export default function App() {
  return (
    <>
      <a
        href="#o-nas"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Preskočiť na obsah
      </a>

      <Nav />

      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <Faq />
        <Clients />
        <CtaBand />
        <Contact />
      </main>

      <Footer />
      <MobileActionBar />
    </>
  )
}

import HeroSection from '@/components/sections/HeroSection'
import HowItWorks from '@/components/sections/HowItWorks'
import FleetSection from '@/components/sections/FleetSection'
import PackagesSection from '@/components/sections/PackagesSection'
import LocationSection from '@/components/sections/LocationSection'
import ContactSection from '@/components/sections/ContactSection'
// ISOLA COMACINA EVENT (remove after 2026-06-27)
import IsolaComacinaBanner from '@/components/isola-comacina/IsolaComacinaBanner'

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      {/* ISOLA COMACINA EVENT — disabled until next season. Flip `false` to `true` to restore. */}
      {false && <IsolaComacinaBanner />}
      <HowItWorks />
      <FleetSection />
      <PackagesSection />
      <LocationSection />
      <ContactSection />
    </main>
  )
}

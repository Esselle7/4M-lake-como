import HeroSection from '@/components/sections/HeroSection'
import HowItWorks from '@/components/sections/HowItWorks'
import FleetSection from '@/components/sections/FleetSection'
import PackagesSection from '@/components/sections/PackagesSection'
import LocationSection from '@/components/sections/LocationSection'
import ContactSection from '@/components/sections/ContactSection'
// BELLAGIO EVENT (remove after 2026-06-27)
import BellagioBanner from '@/components/bellagio/BellagioBanner'

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      {/* BELLAGIO EVENT (remove after 2026-06-27) */}
      <BellagioBanner />
      <HowItWorks />
      <FleetSection />
      <PackagesSection />
      <LocationSection />
      <ContactSection />
    </main>
  )
}

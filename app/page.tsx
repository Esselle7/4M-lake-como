import HeroSection from '@/components/sections/HeroSection'
import HowItWorks from '@/components/sections/HowItWorks'
import FleetSection from '@/components/sections/FleetSection'
import PackagesSection from '@/components/sections/PackagesSection'
import LocationSection from '@/components/sections/LocationSection'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      <HowItWorks />
      <FleetSection />
      <PackagesSection />
      <LocationSection />
      <ContactSection />
    </main>
  )
}

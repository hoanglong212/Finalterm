import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import HeroSection from '../components/HeroSection'
import WhatWeCoverSection from '../components/WhatWeCoverSection'
import MissionSection from '../components/MissionSection'
import SubscribeSection from '../components/SubscribeSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <SiteHeader />
      <HeroSection />
      <div className="border-t-4 mt-8">
        <WhatWeCoverSection />
        <MissionSection />
        <SubscribeSection />
        <SiteFooter />
      </div>
    </div>
  )
}
console.log('HOME PAGE NEW VERSION')

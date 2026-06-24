import { Header } from '@/components/Header'
import { AlertBanner } from '@/components/AlertBanner'
import { BusinessOverview } from './sections/BusinessOverview'
import { LeanOperations } from './sections/LeanOperations'
import { CustomerVoice } from './sections/CustomerVoice'
import { InternalAudit } from './sections/InternalAudit'

export function DashboardPage() {
  return (
    <div className="pb-8 bg-page-body min-h-screen">
      <Header />
      <div className="page-container space-y-4">
        <AlertBanner />
        <BusinessOverview />
        <LeanOperations />
        <CustomerVoice />
        <InternalAudit />
      </div>
    </div>
  )
}

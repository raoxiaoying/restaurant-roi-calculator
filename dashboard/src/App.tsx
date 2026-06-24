import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { DashboardPage } from '@/pages/DashboardPage'
import { RevenueTotal } from '@/pages/drilldown/RevenueTotal'
import { RevenueDineIn } from '@/pages/drilldown/RevenueDineIn'
import { RevenueDelivery } from '@/pages/drilldown/RevenueDelivery'
import { FoodCost } from '@/pages/drilldown/FoodCost'
import { HRLabor } from '@/pages/drilldown/HRLabor'
import { HRSchedule } from '@/pages/drilldown/HRSchedule'
import { HRTraining } from '@/pages/drilldown/HRTraining'
import { HRTurnover } from '@/pages/drilldown/HRTurnover'
import { KitchenEfficiency } from '@/pages/drilldown/KitchenEfficiency'
import { AuditReturns } from '@/pages/drilldown/AuditReturns'
import { AuditComplimentary } from '@/pages/drilldown/AuditComplimentary'
import { AuditPriceChange } from '@/pages/drilldown/AuditPriceChange'
import { AuditSoldOut } from '@/pages/drilldown/AuditSoldOut'
import { InventoryEfficiency } from '@/pages/drilldown/InventoryEfficiency'
import { VoiceMeituan } from '@/pages/drilldown/VoiceMeituan'
import { VoiceDianping } from '@/pages/drilldown/VoiceDianping'
import { VoiceDeliveryRatings } from '@/pages/drilldown/VoiceDeliveryRatings'
import { VoiceDeliveryDetail } from '@/pages/drilldown/VoiceDeliveryDetail'
import { VoiceReviews } from '@/pages/drilldown/VoiceReviews'
import { ReviewTagDetail } from '@/pages/drilldown/ReviewTagDetail'
import { InternalAuditDetail } from '@/pages/drilldown/InternalAuditDetail'
import { StoreScoreTrend } from '@/pages/drilldown/StoreScoreTrend'

function App() {
  return (
    <BrowserRouter basename="/restaurant-roi-calculator">
      <AppProvider>
        <div className="min-h-screen bg-background max-w-[430px] mx-auto relative overflow-x-hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/revenue/total" element={<RevenueTotal />} />
            <Route path="/revenue/dine-in" element={<RevenueDineIn />} />
            <Route path="/revenue/delivery" element={<RevenueDelivery />} />
            <Route path="/food-cost" element={<FoodCost />} />
            <Route path="/hr/labor" element={<HRLabor />} />
            <Route path="/hr/schedule" element={<HRSchedule />} />
            <Route path="/hr/training" element={<HRTraining />} />
            <Route path="/hr/turnover" element={<HRTurnover />} />
            <Route path="/kitchen" element={<KitchenEfficiency />} />
            <Route path="/audit/returns" element={<AuditReturns />} />
            <Route path="/audit/complimentary" element={<AuditComplimentary />} />
            <Route path="/audit/price-change" element={<AuditPriceChange />} />
            <Route path="/audit/sold-out" element={<AuditSoldOut />} />
            <Route path="/sold-out" element={<AuditSoldOut />} />
            <Route path="/inventory" element={<InventoryEfficiency />} />
            <Route path="/voice/meituan" element={<VoiceMeituan />} />
            <Route path="/voice/dianping" element={<VoiceDianping />} />
            <Route path="/voice/delivery-ratings" element={<VoiceDeliveryRatings />} />
            <Route path="/voice/delivery/:id" element={<VoiceDeliveryDetail />} />
            <Route path="/voice/reviews" element={<VoiceReviews />} />
            <Route path="/voice/tag/:tag" element={<ReviewTagDetail />} />
            <Route path="/internal-audit/:id" element={<InternalAuditDetail />} />
            <Route path="/store-score" element={<StoreScoreTrend />} />
          </Routes>
        </div>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App

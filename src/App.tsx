import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from '@/context/NavigationContext';
import { DataProvider } from '@/context/DataContext';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Home } from '@/pages/Home';
import { RevenueTotal } from '@/pages/RevenueTotal';
import { RevenueDineIn } from '@/pages/RevenueDineIn';
import { RevenueDelivery } from '@/pages/RevenueDelivery';
import { FoodCost } from '@/pages/FoodCost';
import { HRLabor } from '@/pages/HRLabor';
import { HRSchedule } from '@/pages/HRSchedule';
import { HRTraining } from '@/pages/HRTraining';
import { HRTurnover } from '@/pages/HRTurnover';
import { KitchenEfficiency } from '@/pages/KitchenEfficiency';
import { AuditAdjustments } from '@/pages/AuditAdjustments';
import { AuditSoldOut } from '@/pages/AuditSoldOut';
import { InventoryEfficiency } from '@/pages/InventoryEfficiency';
import { VoiceMeituan } from '@/pages/VoiceMeituan';
import { VoiceDianping } from '@/pages/VoiceDianping';
import { VoiceDeliveryRatings } from '@/pages/VoiceDeliveryRatings';
import { VoiceReviews } from '@/pages/VoiceReviews';
import { ReviewTagDetail } from '@/pages/ReviewTagDetail';
import { InternalAuditDetail } from '@/pages/InternalAuditDetail';
import { StoreScoreTrend } from '@/pages/StoreScoreTrend';

function App() {
  return (
    <BrowserRouter basename="/restaurant-roi-calculator">
      <NavigationProvider>
        <DataProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/revenue/total" element={<RevenueTotal />} />
            <Route path="/revenue/dine-in" element={<RevenueDineIn />} />
            <Route path="/revenue/delivery" element={<RevenueDelivery />} />
            <Route path="/food-cost" element={<FoodCost />} />
            <Route path="/hr/labor" element={<HRLabor />} />
            <Route path="/hr/schedule" element={<HRSchedule />} />
            <Route path="/hr/training" element={<HRTraining />} />
            <Route path="/hr/turnover" element={<HRTurnover />} />
            <Route path="/kitchen" element={<KitchenEfficiency />} />
            <Route path="/audit/adjustments" element={<AuditAdjustments />} />
            <Route path="/sold-out" element={<AuditSoldOut />} />
            <Route path="/inventory" element={<InventoryEfficiency />} />
            <Route path="/voice/meituan" element={<VoiceMeituan />} />
            <Route path="/voice/dianping" element={<VoiceDianping />} />
            <Route path="/voice/delivery-ratings" element={<VoiceDeliveryRatings />} />
            <Route path="/voice/reviews" element={<VoiceReviews />} />
            <Route path="/voice/tag/:tag" element={<ReviewTagDetail />} />
            <Route path="/internal-audit/:id" element={<InternalAuditDetail />} />
            <Route path="/store-score" element={<StoreScoreTrend />} />
          </Routes>
        </DataProvider>
      </NavigationProvider>
    </BrowserRouter>
  );
}

export default App;

import { Header } from '@/components/Header';
import { AlertBanner } from '@/components/AlertBanner';
import { BusinessOverview } from '@/components/BusinessOverview';
import { CustomerVoice } from '@/components/CustomerVoice';
import { LeanOperations } from '@/components/LeanOperations';
import { InternalAudit } from '@/components/InternalAudit';

export const Home = () => {
  return (
    <div className="min-h-screen bg-bg-page">
      <Header />
      <AlertBanner />
      <BusinessOverview />
      <CustomerVoice />
      <LeanOperations />
      <InternalAudit />
    </div>
  );
};

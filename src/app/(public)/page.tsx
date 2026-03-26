import { LandingPage as MarketingLandingPage } from '@/components/universe/LandingPage';

export default function PublicLandingPage() {
  return (
    <MarketingLandingPage isSignedIn={false} userLabel={null} />
  );
}

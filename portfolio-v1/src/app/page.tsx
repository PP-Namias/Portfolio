import { IS_STREAMING_SSR_ENABLED } from '@/lib/features';
import { HomeContent } from '@/components/sections/HomeContent';
import { HomeContentStreaming } from '@/components/sections/HomeContentStreaming';

export default function Home() {
  if (IS_STREAMING_SSR_ENABLED) {
    return <HomeContentStreaming />;
  }
  return <HomeContent />;
}

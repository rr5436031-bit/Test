'use client';

import { useState } from 'react';
import OrientationGate from '@/components/ui/OrientationGate';
import SplashScreen from '@/components/ui/SplashScreen';
import LobbyScreen from '@/components/lobby/LobbyScreen';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  return (
    <OrientationGate>
      {loading ? <SplashScreen onDone={() => setLoading(false)} /> : <LobbyScreen />}
    </OrientationGate>
  );
}

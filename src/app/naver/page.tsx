'use client';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/units/Map/MapView'), {
  ssr: false,
});

export default function Page() {
  return <MapView filteredClubs={[]} />;
}

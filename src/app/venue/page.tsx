'use client'
import MapView from '@/components/units/Search/Map/MapView';
function VenuePage() {
  return <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
    <MapView filteredClubs={[]} />
  </div>;
}

export default VenuePage;

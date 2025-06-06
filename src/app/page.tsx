'use client';

import HomeSelect from '@/components/units/home/HomeSelect';
import MaintenancePage from '@/app/maintenance/page';

export default function MainPage() {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';

  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <div className="w-full bg-BG-black">
      <HomeSelect />
    </div>
  );
}

import React from 'react';
import { clubs } from '@/lib/data';
import BBPHeader from '@/components/units/BBPList/BBPHeader';
import VenueCard from '@/components/units/BBPList/VenueCard';
import Footer from '@/components/units/Main/MainFooter';

function BBPList() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <BBPHeader />
      <main className="px-[1rem] pt-[1.75rem]">
        <div className="grid grid-cols-1 gap-x-[1rem] gap-y-[2.5rem] md:grid-cols-2">
          {clubs.map((club) => (
            <VenueCard key={club.id} club={club} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BBPList;

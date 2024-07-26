import React from 'react';
import BBPHeader from '@/components/units/BBPList/BBPHeader';
import VenueCard from '@/components/units/BBPList/VenueCard';
import Footer from '@/components/units/Main/MainFooter';
import BBPMain from '@/components/units/BBPList/BBPMain';
function BBPList() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
     <BBPMain/>
    </div>
  );
}

export default BBPList;

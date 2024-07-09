'use client';

import React from 'react';
import { clubs } from '@/lib/data';
import Footer from '@/components/units/Main/MainFooter';
import Preview from '@/components/units/Detail/Preview';
import Location from '@/components/units/Detail/Location';
import Info from '@/components/units/Detail/Info';
import VenueHours from '@/components/units/Detail/VenueHours';
import CustomerService from '@/components/units/Detail/CustomerService';

const DetailPage = ({ params }: { params: { id: string } }) => {
  const club = clubs.find((club) => club.id === parseInt(params.id));

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <Preview club={club} />
      <Location club={club} />
      <Info club={club} />
      <VenueHours hours={club.hours} />
      <CustomerService />
      <Footer />
    </div>
  );
};

export default DetailPage;

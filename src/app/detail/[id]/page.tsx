// src/app/detail/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Footer from '@/components/units/Main/MainFooter';
import Preview from '@/components/units/Detail/Preview';
import Location from '@/components/units/Detail/Location';
import Info from '@/components/units/Detail/Info';
import VenueHours from '@/components/units/Detail/VenueHours';
import CustomerService from '@/components/units/Detail/CustomerService';
import { fetchClubDetail } from '@/lib/actions/detail-controller/fetchClubDetail';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { Club, ClubProps } from '@/lib/types';

const DetailPage = ({ params }: { params: { id: string } }) => {
  const [venue, setVenue] = useState<Club | null>(null);
  const [isHeartbeat, setIsHeartbeat] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const getClubDetail = async () => {
      try {
        if (accessToken) {
          const data: ClubProps = await fetchClubDetail(params.id, accessToken);
          setVenue(data.venue);
          setIsHeartbeat(data.isHeartbeat);
        } else {
          console.error('Access token is not available');
        }
      } catch (error) {
        console.error('Error fetching club data:', error);
      } finally {
        setLoading(false);
      }
    };

    getClubDetail();
  }, [params.id, accessToken]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-BG-black text-white justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-BG-black text-white justify-center items-center">
        <p>Club data not found.</p>
      </div>
    );
  }

  const operationHours = typeof venue.operationHours === 'object' && venue.operationHours !== null
    ? venue.operationHours
    : {};

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <Preview venue={venue} isHeartbeat={isHeartbeat} />
      <Location venue={venue} />
      <Info venue={venue} isHeartbeat={isHeartbeat} />
      <VenueHours hours={operationHours} />
      <CustomerService />
      <Footer />
    </div>
  );
};

export default DetailPage;

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

const DetailPage = ({ params }: { params: { id: string } }) => {
  const [club, setClub] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const getClubDetail = async () => {
      try {
        if (accessToken) {
          const data = await fetchClubDetail(params.id, accessToken);
          setClub(data);
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

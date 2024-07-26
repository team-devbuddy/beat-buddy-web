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
          console.log(data);
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

  // 요일별로 운영 시간 분리
  const operationHours = parseOperationHours(venue.operationHours || '');

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

// 요일별 운영 시간을 파싱하는 함수
const parseOperationHours = (operationHoursString: string): { [key: string]: string } => {
  const daysOfWeek = ['월', '화', '수', '목', '금', '토', '일'];
  const operationHours: { [key: string]: string } = {
    월: '운영하지 않음',
    화: '운영하지 않음',
    수: '운영하지 않음',
    목: '운영하지 않음',
    금: '운영하지 않음',
    토: '운영하지 않음',
    일: '운영하지 않음',
  };

  const hoursEntries = operationHoursString.split('/');
  hoursEntries.forEach((entry) => {
    const [daysPart, hoursPart] = entry.trim().split(' ');
    const days = daysPart.split(',');

    days.forEach((day) => {
      const trimmedDay = day.trim().replace(/\*|\(.+\)/g, ''); 
      if (daysOfWeek.includes(trimmedDay)) {
        operationHours[trimmedDay] = hoursPart.trim();
      }
    });
  });

  return operationHours;
};

export default DetailPage;

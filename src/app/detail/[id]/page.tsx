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
import { Club } from '@/lib/types';
import Loading from '@/components/common/skeleton/LoadingLottie';
import DetailCategoryBar from '@/components/units/Detail/DetailCategoryBar';

const DetailPage = ({ params }: { params: { id: string } }) => {
  const [venue, setVenue] = useState<Club | null>(null);
  const [isHeartbeat, setIsHeartbeat] = useState<boolean>(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('info'); // 활성 탭 상태 추가
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const getClubDetail = async () => {
      try {
        if (accessToken) {
          const data = await fetchClubDetail(params.id, accessToken);
          setVenue(data.venue);
          setIsHeartbeat(data.isHeartbeat);
          setTagList(data.tagList);
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
    return <Loading />;
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-BG-black text-white">
        <p>Club data not found.</p>
      </div>
    );
  }

  // 활성화된 탭에 따라 콘텐츠를 조건부로 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <>
            <Info venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
            <Location venue={venue} />
            <VenueHours hours={venue.operationHours} />
            <CustomerService />
          </>
        );
      case 'review':
        return <div>리뷰 콘텐츠</div>; 
      case 'news':
        return <div>뉴스 콘텐츠</div>; 
      case 'board':
        return <div>게시판 콘텐츠</div>; 
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <Preview venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
      <DetailCategoryBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow">{renderContent()}</div>
      <Footer />
    </div>
  );
};

export default DetailPage;

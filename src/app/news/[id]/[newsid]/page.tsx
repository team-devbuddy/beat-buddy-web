'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import NewsDetailInfo from '@/components/units/Detail/News/Detail/NewsDetailInfo';
import NewsDetailPreview from '@/components/units/Detail/News/Detail/NewsDetailPreview';
import { mockNewsList } from '@/lib/dummyData';
import dayjs from 'dayjs';
import NewsDetailFooter from '@/components/units/Detail/News/Detail/NewsDetailFooter';

const calculateDday = (dateRange: string): string => {
  if (!dateRange || !dateRange.includes('~')) {
    return '날짜 정보 없음';
  }

  const today = dayjs();
  const [_, endDateStr] = dateRange.split('~').map((date) => date.trim());
  const endDate = dayjs(endDateStr);

  if (!endDate.isValid()) {
    return '종료됨';
  }

  const diff = endDate.diff(today, 'day');
  return diff < 0 ? '종료됨' : `D-${diff}`;
};

const NewsDetailPage = () => {
  const params = useParams();
  const newsId = params.newsid; // URL에서 newsid 가져오기

  // 뉴스 데이터 가져오기
  const newsData = mockNewsList.find((news) => String(news.id) === newsId);

  if (!newsData) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-BG-black text-white">
        <p>해당 뉴스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // D-Day 계산
  const dDay = calculateDday(newsData.dateRange);

  return (
    <div className="relative min-h-screen bg-BG-black text-white">
      {/* 뉴스 미리보기 섹션 */}
      <NewsDetailPreview
        images={newsData.images || []}
        title={newsData.title}
        dateRange={newsData.dateRange}
        dDay={dDay} // D-Day 전달
        location={newsData.location} // location 추가
      />

      {/* 뉴스 정보 섹션 */}
      <NewsDetailInfo
        description={newsData.description}
        images={newsData.images || []} // 이미지 전달
      />

      {/* 고정된 Footer */}
      <NewsDetailFooter onClick={() => console.log('예매하기 버튼 클릭됨')} />
    </div>
  );
};

export default NewsDetailPage;

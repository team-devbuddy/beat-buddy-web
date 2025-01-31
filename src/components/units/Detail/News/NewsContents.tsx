'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Next.js Link import
import dayjs from 'dayjs';

interface NewsItem {
  id: string;
  title: string;
  dateRange: string;
  imageUrl: string;
}

interface NewsContentsProps {
  newsList: NewsItem[];
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const calculateDday = (dateRange: string) => {
  const today = dayjs();
  const endDate = dayjs(dateRange.split('~')[1]?.trim());

  if (!endDate.isValid()) {
    return 'END';
  }

  const diff = endDate.diff(today, 'day');
  return diff < 0 ? 'END' : `D-${diff}`;
};

const sortNewsByDday = (newsList: NewsItem[]) => {
  return [...newsList].sort((a, b) => {
    const getDdayValue = (dDay: string) => {
      if (dDay === 'END') {
        return Number.MAX_SAFE_INTEGER; // END는 항상 마지막
      }
      if (dDay.startsWith('D-')) {
        return parseInt(dDay.split('-')[1], 10); // D-숫자에서 숫자만 추출
      }
      return 0; // 기타 값은 최소값으로 설정
    };

    const aDday = calculateDday(a.dateRange);
    const bDday = calculateDday(b.dateRange);

    return getDdayValue(aDday) - getDdayValue(bDday);
  });
};

const EmptyNews = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
      <p className="text-body2-15-medium text-gray300">아직 등록된 뉴스가 없습니다.</p>
    </div>
  );
};

const NewsContents = ({ newsList }: NewsContentsProps) => {
  if (newsList.length === 0) {
    return <EmptyNews />;
  }

  const sortedNewsList = sortNewsByDday(newsList);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedNewsList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedNewsList.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getDdayStyle = (dDay: string) => {
    if (dDay === 'END') {
      return 'bg-gray500 text-gray200';
    }
    if (dDay.startsWith('D-')) {
      const dayNumber = parseInt(dDay.split('-')[1], 10);
      return dayNumber <= 7 ? 'bg-main text-white' : 'bg-gray500 text-gray200';
    }
    return 'bg-gray500 text-gray200';
  };

  return (
    <div className="px-4 py-4">
      {/* 뉴스 목록 */}
      <div className="grid grid-cols-2 gap-4">
        {currentItems.map((news) => (
          <Link key={news.id} href={`/news/${news.id}`} passHref>
            <div className="flex cursor-pointer flex-col overflow-hidden rounded-[0.25rem]">
              {/* 이미지 */}
              <div className="h-[160px] w-full rounded-[0.25rem] overflow-hidden">
                <img src={news.imageUrl} alt={news.title} className="h-full w-full object-cover object-top" />
              </div>

              {/* 뉴스 정보 */}
              <div className="flex flex-col p-4">
                <div className="flex items-center">
                  <h3 className="max-w-[70%] truncate text-body1-16-bold text-white">{truncateText(news.title, 12)}</h3>
                  <span
                    className={`ml-[0.38rem] w-[2.5rem] flex-shrink-0 rounded-xs px-[0.38rem] py-[0.13rem] text-center text-body3-12-medium ${getDdayStyle(
                      calculateDday(news.dateRange),
                    )}`}
                    style={{
                      whiteSpace: 'nowrap',
                    }}>
                    {calculateDday(news.dateRange)}
                  </span>
                </div>
                <span
                  className="text-body3-12-medium text-gray300"
                  style={{
                    whiteSpace: 'nowrap',
                  }}>
                  {news.dateRange}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-6 flex items-center justify-center space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentPage > 1 ? 'text-main' : 'text-gray500'
          }`}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`flex h-8 w-8 items-center justify-center ${
              currentPage === index + 1 ? 'text-main' : 'text-gray300 hover:bg-gray500'
            }`}>
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            currentPage < totalPages ? 'text-main' : 'text-gray500'
          }`}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default NewsContents;

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { searchEventsByPeriod } from '@/lib/actions/event-controller/searchEventsByPeriod';
import EventLists from '@/components/units/Event/EventLists';
import { motion, AnimatePresence } from 'framer-motion';
import { EventType } from '@/components/units/Event/EventContainer';
import Image from 'next/image';
import BoardSearchHeader from '@/components/units/Board/Search/BoardSearchHeader';
import BoardRecentTerm from '@/components/units/Board/Search/BoardRecentTerm';

export default function EventSearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegionFilter, setShowRegionFilter] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('가까운순');

  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const regionOptions = ['이태원', '홍대', '압구정 로데오', '강남 신사', '기타'];
  const sortOptions = ['가까운순', '인기순', '최신순'];

  // URL 쿼리에서 날짜를 파싱하는 함수
  const parseDateFromQuery = (dateString: string) => {
    if (!dateString || dateString.length !== 8) return null;

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${year}-${month}-${day}`;
  };

  // 파싱된 날짜들
  const parsedStartDate = startDate ? parseDateFromQuery(startDate) : null;
  const parsedEndDate = endDate ? parseDateFromQuery(endDate) : null;

  // 날짜 형식을 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜 범위를 YYYY-MM-DD ~ YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateRange = (startDate: string, endDate: string) => {
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    return `${formattedStart} ~ ${formattedEnd}`;
  };

  // 날짜를 YY. MM. DD. 형식으로 변환하는 함수
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}.`;
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]));
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    setSortOpen(false);
  };

  const clearDateFilter = () => {
    router.push('/event');
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!parsedStartDate || !parsedEndDate || !accessToken) {
        setError('검색 조건이 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await searchEventsByPeriod(startDate!, endDate!, 1, 10, accessToken);

        if (response.data?.eventResponseDTOS) {
          setEvents(response.data.eventResponseDTOS);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('검색 중 오류가 발생했습니다.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [parsedStartDate, parsedEndDate, accessToken, startDate, endDate]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-BG-black text-white">
        <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray300 border-t-main"></div>
        <p className="text-body2-15-medium text-gray300">검색 결과를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-BG-black text-white">
        <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
        <p className="text-body2-15-medium text-gray300">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-BG-black text-white">
      <BoardSearchHeader placeholder="이벤트를 입력해주세요." onSearchSubmit={() => {}} isEvent={true} />

      {/* 필터 UI */}
      <div className="bg-BG-black px-5 pt-[0.62rem]">
        <div className="flex items-center justify-between">
          {/* 왼쪽 필터들 */}
          <div className="flex items-center gap-2">
            {/* 지역 필터 */}
            <button
              className={`rounded-[0.5rem] px-[0.62rem] py-[0.25rem] text-[0.875rem] focus:outline-none ${
                selectedRegions.length > 0 ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
              }`}
              onClick={() => setShowRegionFilter(!showRegionFilter)}>
              지역
            </button>

            {/* 날짜 범위 필터 */}
            {parsedStartDate && parsedEndDate && (
              <div className="flex items-center justify-start gap-1 rounded-[0.5rem] bg-sub2 px-[0.62rem] py-[0.25rem]">
                <span className="text-[0.875rem] font-medium text-main">
                  {formatDateForDisplay(parsedStartDate)} ~ {formatDateForDisplay(parsedEndDate)}
                </span>
                <button
                  title="날짜 필터 초기화"
                  onClick={clearDateFilter}
                  className="flex items-center justify-center rounded-full">
                  <Image src="/icons/xmark-pink.svg" alt="x" width={8} height={8} />
                </button>
              </div>
            )}
          </div>

          {/* 오른쪽 정렬 옵션 */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-[0.875rem] text-gray300"
              onClick={() => setSortOpen(!sortOpen)}>
              {selectedSort}
              <Image
                src="/icons/chevron.forward.svg"
                alt="arrow_down"
                width={12}
                height={12}
                className="text-gray300"
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-0 bg-black bg-opacity-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSortOpen(false)}
                  />

                  <motion.div
                    className="bg-gray800 absolute right-0 z-10 mt-2 w-[6.5rem] overflow-hidden rounded-[0.5rem] shadow-lg"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}>
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortSelect(option)}
                        className={`block w-full py-[0.56rem] text-center text-[0.8125rem] hover:bg-gray700 ${
                          selectedSort === option ? 'bg-gray500 font-bold text-main' : 'bg-gray500 text-gray100'
                        }`}>
                        {option}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 지역 필터 드롭다운 */}
        <AnimatePresence>
          {showRegionFilter && (
            <motion.div
              className="mt-3 flex w-full flex-wrap gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              {regionOptions.map((region) => {
                const isSelected = selectedRegions.includes(region);

                return (
                  <motion.button
                    key={region}
                    onClick={() => handleRegionToggle(region)}
                    whileTap={{ scale: 1.1 }}
                    className={`rounded-[0.38rem] px-[0.63rem] py-[0.25rem] text-[0.875rem] focus:outline-none ${
                      isSelected ? 'bg-sub2 text-main' : 'bg-gray700 text-gray400'
                    }`}
                    transition={{ type: 'spring', stiffness: 300 }}>
                    {region}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 검색 결과 */}
      <div className="px-5 pt-5">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
            <p className="text-body2-15-medium text-gray300">해당 기간에 등록된 이벤트가 없습니다.</p>
          </div>
        ) : (
          <EventLists tab="upcoming" events={events} setEvents={setEvents} onLoadMore={() => setPage((prev) => prev + 1)}
          hasMore={hasMore}
          loading={loading} />
        )}
      </div>
    </div>
  );
}

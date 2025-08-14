'use client';

import React, { forwardRef, useEffect, useState, useImperativeHandle, useCallback } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  likedClubsState,
  heartbeatNumsState,
  accessTokenState,
  isMapViewState,
  searchQueryState,
  selectedGenreState,
  selectedLocationState,
  selectedOrderState,
  clickedClubState,
} from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { SearchResultsProps } from '@/lib/types';
import DropdownGroup from '../DropdownGroup';
import ClubList from '../../Main/ClubList';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import ClickedClubDetails from './ClickedClub';
import SearchListSkeleton from '@/components/common/skeleton/SearchListSkeleton';
import NoResults from '../NoResult';
import { searchMapDropdown } from '@/lib/actions/search-controller/mapDropdown';

export interface BottomSheetProps extends SearchResultsProps {
  isMapSearched?: boolean;
}

export interface BottomSheetRef {
  close: () => void;
  openWithSnap: (snapIndex: number) => void;
}

const BottomSheetComponent = forwardRef<BottomSheetRef, BottomSheetProps>(({ filteredClubs, isMapSearched }, ref) => {
  const [isOpen, setOpen] = useState(true);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
  const [selectedSort, setSelectedSort] = useRecoilState(selectedOrderState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const clickedClub = useRecoilValue(clickedClubState);
  const [height, setHeight] = useState<number>(834);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialSnapPoint, setInitialSnapPoint] = useState<number>(2);
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [currentSnapPoint, setCurrentSnapPoint] = useState<number>(2);
  const [currentFilteredClubs, setCurrentFilteredClubs] = useState(filteredClubs);

  const genres = ['힙합', 'R&B', '테크노', 'EDM', '소울&펑크', 'ROCK', '하우스', 'POP', '라틴', 'K-POP'];
  const locations = ['홍대', '이태원', '강남/신사', '압구정', '기타'];
  const sorts = ['가까운 순', '인기순'];

  // 매핑 객체들
  const genresMap: { [key: string]: string } = {
    힙합: 'HIPHOP',
    'R&B': 'R&B',
    테크노: 'TECHNO',
    EDM: 'EDM',
    하우스: 'HOUSE',
    라틴: 'LATIN',
    '소울&펑크': 'SOUL&FUNK',
    'K-POP': 'K-POP',
    락: 'ROCK',
    POP: 'POP',
  };

  const locationsMap: { [key: string]: string } = {
    홍대: '홍대',
    이태원: '이태원',
    '강남/신사': '강남/신사',
    압구정: '압구정',
    기타: '기타',
  };

  const criteriaMap: { [key: string]: string } = {
    '가까운 순': '가까운 순',
    인기순: '인기순',
  };

  // 바텀시트 높이 설정
  const snapPoints = clickedClub ? [height - 10, 260, 70] : [height - 10, 470, 70];

  useImperativeHandle(ref, () => ({
    close: () => setOpen(false),
    openWithSnap: (snapIndex: number) => {
      setInitialSnapPoint(snapIndex);
      setOpen(true);
      setForceUpdateKey((prev) => prev + 1);
    },
  }));

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
    setLoading(false);
  }, [searchParams, searchQuery, setSearchQuery]);

  useEffect(() => {
    function updateSnapPoints() {
      const calculateHeight = window.innerHeight - 53;
      setHeight(calculateHeight);
    }
    updateSnapPoints();
    window.addEventListener('resize', updateSnapPoints);
    return () => {
      window.removeEventListener('resize', updateSnapPoints);
    };
  }, []);

  // 드롭다운 상태 변경 감지 및 필터링 실행
  useEffect(() => {
    console.log('🔄 드롭다운 상태 변경 감지:', {
      selectedGenre: `"${selectedGenre}"`,
      selectedLocation: `"${selectedLocation}"`,
      selectedSort: `"${selectedSort}"`,
      filteredClubsLength: filteredClubs?.length,
      isMapSearched,
      timestamp: new Date().toLocaleTimeString(),
    });

    // 모든 드롭다운이 해제된 상태면 원본 리스트 표시
    const isAllFiltersEmpty = !selectedGenre && !selectedLocation && (selectedSort === '가까운 순' || !selectedSort);
    console.log('🔍 필터 상태 체크:', {
      isAllFiltersEmpty,
      selectedGenre: !!selectedGenre,
      selectedLocation: !!selectedLocation,
      selectedSort: selectedSort === '가까운 순' || !selectedSort,
    });

    if (isAllFiltersEmpty) {
      console.log('🔄 모든 필터 해제 - 원본 리스트 표시');
      setCurrentFilteredClubs(filteredClubs);
      return;
    }

    // 직접 필터링 로직 실행 (무한루프 방지)
    const executeFiltering = async () => {
      console.log('🔍 드롭다운 필터링 시작:', {
        selectedGenre,
        selectedLocation,
        selectedSort,
        filteredClubsLength: filteredClubs?.length,
        currentFilteredClubsLength: currentFilteredClubs?.length,
      });

      setLoading(true);
      try {
        const filters = {
          keyword: searchQuery || '',
          genreTag: genresMap[selectedGenre] || '',
          regionTag: locationsMap[selectedLocation] || '',
          sortCriteria: criteriaMap[selectedSort] || '인기순',
        };

        console.log('📤 필터 요청 데이터:', filters);
        const data = await searchMapDropdown(filters, accessToken);
        console.log('📥 필터 응답 데이터:', data);
        setCurrentFilteredClubs(data.clubs);
      } catch (error) {
        console.error('드롭다운 필터링 에러:', error);
        setCurrentFilteredClubs(filteredClubs);
      } finally {
        setLoading(false);
      }
    };

    executeFiltering();
  }, [selectedGenre, selectedLocation, selectedSort]); // fetchFilteredClubsByDropdown 제거

  // filteredClubs 변경 시 currentFilteredClubs 초기화
  useEffect(() => {
    setCurrentFilteredClubs(filteredClubs);
  }, [filteredClubs]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, id: number) => {
    await handleHeartClick(e, id, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex w-full flex-col">
      <AnimatePresence>
        {isOpen && (
          <Sheet
            key={forceUpdateKey}
            className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
            isOpen={true}
            onClose={() => setOpen(true)}
            initialSnap={initialSnapPoint}
            snapPoints={snapPoints}
            onSnap={(index) => setCurrentSnapPoint(index)}>
            <Sheet.Container className="relative h-full w-full !shadow-none">
              <Sheet.Header className="relative flex w-full cursor-pointer flex-col justify-center rounded-t-lg bg-BG-black pt-[6px]">
                <div className="flex justify-center">
                  <div className="my-2 h-[0.25rem] w-[5rem] rounded-[2px] border-none bg-gray500" />
                </div>
                {!clickedClub && (
                  <div className="w-full pb-[0.5rem] pt-2">
                    <DropdownGroup
                      genres={genres}
                      locations={locations}
                      criteria={sorts}
                      selectedGenre={selectedGenre}
                      setSelectedGenre={setSelectedGenre}
                      selectedLocation={selectedLocation}
                      setSelectedLocation={setSelectedLocation}
                      selectedOrder={selectedSort}
                      setSelectedOrder={setSelectedSort}
                    />
                  </div>
                )}
              </Sheet.Header>
              <Sheet.Content className="relative z-10 w-full bg-BG-black" disableDrag={true}>
                <div className="club-list-container flex w-full flex-col bg-BG-black text-[0.93rem]">
                  <div
                    className={`w-full flex-wrap gap-4 ${
                      !clickedClub && currentSnapPoint === 0
                        ? 'pb-[60px]'
                        : !clickedClub && currentSnapPoint === 1
                          ? 'pb-[200px]'
                          : ''
                    }`}>
                    {loading ? (
                      <SearchListSkeleton />
                    ) : clickedClub ? (
                      <ClickedClubDetails
                        likedClubs={likedClubs}
                        heartbeatNums={heartbeatNums}
                        handleHeartClickWrapper={handleHeartClickWrapper}
                      />
                    ) : (currentFilteredClubs?.length ?? 0) > 0 ? (
                      <div className="flex px-5">
                        <ClubList
                          clubs={currentFilteredClubs}
                          likedClubs={likedClubs}
                          heartbeatNums={heartbeatNums}
                          handleHeartClickWrapper={handleHeartClickWrapper}
                        />
                      </div>
                    ) : (
                      <NoResults text="조건에 맞는 검색 결과가 없어요" />
                    )}
                  </div>
                </div>
              </Sheet.Content>
            </Sheet.Container>
            <style jsx global>{`
              .react-modal-sheet-container {
                background-color: #1c1c1e !important;
              }
              .react-modal-sheet-content {
                background-color: #1c1c1e !important;
                height: 100% !important;
                overflow-y: auto !important;
              }
              .react-modal-sheet-drag-indicator {
                display: none !important;
              }
              .club-list-container {
                min-height: 100%;
              }
            `}</style>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
});

export default BottomSheetComponent;

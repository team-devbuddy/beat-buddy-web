'use client';

import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
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

  const genres = ['힙합', 'R&B', '테크노', 'EDM', '소울&펑크', 'ROCK', '하우스', 'POP', '라틴', 'K-POP'];
  const locations = ['홍대', '이태원', '강남/신사', '압구정', '기타'];
  const sorts = ['가까운 순', '인기순'];

  // 바텀시트 높이 설정
  const snapPoints = clickedClub ? [height, 350, 80] : [height, 470, 80];

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
                  <div className="mt-2 h-[0.25rem] w-[5rem] rounded-[2px] border-none bg-gray500" />
                </div>
                <div className="w-full pb-[0.5rem] pt-[1.25rem]">
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
              </Sheet.Header>
              <Sheet.Content className="relative z-10 w-full bg-BG-black" disableDrag={true}>
                <div className="club-list-container flex w-full flex-col bg-BG-black text-[0.93rem]">
                  <div className={`w-full flex-wrap gap-4 ${currentSnapPoint === 1 ? 'pb-[350px]' : ''}`}>
                    {loading ? (
                      <SearchListSkeleton />
                    ) : clickedClub ? (
                      <ClickedClubDetails
                        likedClubs={likedClubs}
                        heartbeatNums={heartbeatNums}
                        handleHeartClickWrapper={handleHeartClickWrapper}
                      />
                    ) : (filteredClubs?.length ?? 0) > 0 ? (
                      <div className="flex px-5">
                        <ClubList
                          clubs={filteredClubs}
                          likedClubs={likedClubs}
                          heartbeatNums={heartbeatNums}
                          handleHeartClickWrapper={handleHeartClickWrapper}
                        />
                      </div>
                    ) : (
                      <NoResults text="조건에 맞는 검색 결과가 없어요." />
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

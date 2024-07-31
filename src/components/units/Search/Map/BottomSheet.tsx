'use client';
import { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
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

const BottomSheetComponent = forwardRef<{ close: () => void }, SearchResultsProps>(({ filteredClubs }, ref) => {
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

  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const sorts = ['가까운 순', '인기순'];

  useImperativeHandle(ref, () => ({
    close: () => setOpen(false),
  }));

  useEffect(() => {
    const query = searchParams.get('q');
    if (query && query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams, searchQuery, setSearchQuery]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  const handleSnap = (index: number) => {
    if (index === 0) {
      setIsMapView(false);
    }
  };

  const calculatePaddingHeight = () => {
    const viewportHeight = window.innerHeight;
    const paddingHeight = viewportHeight * 0.4; // 화면 40%만큼 패딩 추가 - 이렇게밖에할수없엇던나를용서하시오
    return paddingHeight;
  };

  const [paddingHeight, setPaddingHeight] = useState(calculatePaddingHeight());

  useEffect(() => {
    const handleResize = () => {
      setPaddingHeight(calculatePaddingHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const snapPoints = clickedClub
    ? [window.innerHeight * 0.9, 280, 82]
    : [window.innerHeight * 0.9, window.innerHeight * 0.5, 82];

  return (
    <div className="flex w-full flex-col">
      <AnimatePresence>
        {isOpen && (
          <Sheet
            className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
            isOpen={true}
            onClose={() => setOpen(false)}
            initialSnap={1}
            snapPoints={snapPoints} // 동적으로 snapPoints 설정
            onSnap={handleSnap}>
            <Sheet.Container className="relative h-full w-full !shadow-none transition-all duration-500 ease-in-out">
              <Sheet.Header className="relative flex w-full flex-col justify-center rounded-t-lg bg-BG-black pt-[6px]">
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
              <Sheet.Content
                className="relative z-10 h-full w-full grow overflow-y-auto bg-BG-black"
                disableDrag={true}>
                <div className="club-list-container flex w-full flex-col text-[0.93rem]">
                  <div className="w-full flex-wrap gap-4">
                    {clickedClub ? (
                      <ClickedClubDetails
                        likedClubs={likedClubs}
                        heartbeatNums={heartbeatNums}
                        handleHeartClickWrapper={handleHeartClickWrapper}
                      />
                    ) : (
                      <>
                        <ClubList
                          clubs={filteredClubs}
                          likedClubs={likedClubs}
                          heartbeatNums={heartbeatNums}
                          handleHeartClickWrapper={handleHeartClickWrapper}
                        />
                        <div style={{ height: `${paddingHeight}px` }} />
                      </>
                    )}
                  </div>
                </div>
              </Sheet.Content>
            </Sheet.Container>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
});

export default BottomSheetComponent;

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
  const [height, setHeight] = useState<number>(834);


  const genres = ['힙합', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '강남/신사', '압구정'];
  const sorts = ['관련도 순', '인기순'];

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

  return (
    <div className="flex w-full flex-col">
      <AnimatePresence>
        {isOpen && (
          <Sheet
            className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
            isOpen={true}
            onClose={() => setOpen(false)}
            initialSnap={1}
            snapPoints={[height, 234, 150]}>
            <Sheet.Container className="relative h-full w-full !shadow-none">
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
                        {/* <div style={{ height: `${paddingHeight}px` }} /> */}
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

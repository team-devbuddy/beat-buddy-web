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
} from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { SearchResultsProps } from '@/lib/types';
import DropdownGroup from '../DropdownGroup';
import ClubList from '../../Main/ClubList';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

const BottomSheetComponent = forwardRef<{ close: () => void }, SearchResultsProps>(({ filteredClubs }, ref) => {
  const [height, setHeight] = useState<number>(500);
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

  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const sorts = ['가까운 순', '인기순'];

  useImperativeHandle(ref, () => ({
    close: () => setOpen(false),
  }));

  useEffect(() => {
    function updateSnapPoints() {
      const calculateHeight = window.innerHeight - 122;
      setHeight(Math.max(200, calculateHeight));
    }
    updateSnapPoints();
    window.addEventListener('resize', updateSnapPoints);
    return () => {
      window.removeEventListener('resize', updateSnapPoints);
    };
  }, []);

  useEffect(() => {
    console.log("Filtered Clubs:", filteredClubs);
  }, [filteredClubs]);

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

  return (
    <div className="flex w-full flex-col justify-between">
      <AnimatePresence>
        {isOpen && (
          <Sheet
            className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
            isOpen={true}
            onClose={() => setOpen(false)}
            initialSnap={1}
            snapPoints={[height, 372, 76]}
            onSnap={handleSnap}
          >
            <Sheet.Container className="relative h-full w-full !shadow-none transition-all duration-500 ease-in-out">
              <Sheet.Header className="relative flex h-[2rem] w-full justify-center rounded-t-lg bg-[#131415] pt-[6px]">
                <div className="mt-2 h-[0.25rem] w-[5rem] rounded-[2px] border-none bg-gray500" />
              </Sheet.Header>
              <Sheet.Content className="relative z-10 h-full w-full !grow-0 overflow-y-auto bg-[#131415]" disableDrag={true}>
                <div className=" mt-[0.25rem]">
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
                <div className="bg-#131415 flex flex-col text-[0.93rem]">
                  {isMapView && (
                    <div className="flex w-full flex-wrap justify-between gap-4 ">
                      <ClubList
                        clubs={filteredClubs}
                        likedClubs={likedClubs}
                        heartbeatNums={heartbeatNums}
                        handleHeartClickWrapper={handleHeartClickWrapper}
                      />
                    </div>
                  )}
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

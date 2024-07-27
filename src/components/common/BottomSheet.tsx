'use client';
import { Sheet } from 'react-modal-sheet';
import { useEffect, useState, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { likedClubsState, heartbeatNumsState, accessTokenState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { SearchResultsProps } from '@/lib/types';
import DropdownGroup from '../units/Search/DropdownGroup';
import ClubList from '../units/Main/ClubList';

export default function BottomSheetComponent({ filteredClubs }: SearchResultsProps) {
  const [height, setHeight] = useState<number>(500);
  const [isOpen, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('가까운 순');
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const sorts = ['가까운 순', '인기순'];

  useEffect(() => {
    function updateSnapPoints() {
      const calculateHeight = window.innerHeight - 141;
      setHeight(calculateHeight);
    }
    updateSnapPoints();
    window.addEventListener('resize', updateSnapPoints);
    return () => {
      window.removeEventListener('resize', updateSnapPoints);
    };
  }, []);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <div className="pb-32">
        <Sheet
          className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
          isOpen={true}
          onClose={() => setOpen(false)}
          initialSnap={1}
          snapPoints={[height, 234, 74]}>
          <Sheet.Container className="relative h-full w-full !shadow-none">
            <Sheet.Header className="relative flex h-[40px] w-full justify-center rounded-t-lg bg-[#131415] pt-[6px]">
              <div className="mt-2 h-[0.25rem] w-[5rem] rounded-[2px] bg-gray500" />
            </Sheet.Header>
            <Sheet.Content
              className="relative z-10 h-full w-full !grow-0 overflow-y-scroll bg-[#131415]"
              disableDrag={true}>
              <div className="flex flex-col text-[0.93rem]">
                <DropdownGroup
                  genres={genres}
                  locations={locations}
                  orders={sorts}
                  selectedGenre={selectedGenre}
                  setSelectedGenre={setSelectedGenre}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  selectedOrder={selectedSort}
                  setSelectedOrder={setSelectedSort}
                />
                <div className="flex w-full flex-wrap justify-between gap-4 p-5">
                  <ClubList
                    clubs={filteredClubs}
                    likedClubs={likedClubs}
                    heartbeatNums={heartbeatNums}
                    handleHeartClickWrapper={handleHeartClickWrapper}
                  />
                </div>
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </div>
    </div>
  );
}

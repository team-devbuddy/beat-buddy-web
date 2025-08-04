'use client';
import { useEffect } from 'react';
import { useResetRecoilState } from 'recoil';
import {
  selectedGenreState,
  selectedLocationState,
  selectedOrderState,
  searchQueryState,
  clickedClubState,
} from '@/context/recoil-context';
import MapView from '@/components/units/Map/MapView';

function VenuePage() {
  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);
  const resetSelectedOrder = useResetRecoilState(selectedOrderState);
  const resetSearchQuery = useResetRecoilState(searchQueryState);
  const resetClickedClub = useResetRecoilState(clickedClubState);

  useEffect(() => {
    // venue 페이지 진입 시 검색 관련 상태들을 초기화
    resetSelectedGenre();
    resetSelectedLocation();
    resetSelectedOrder();
    resetSearchQuery();
    resetClickedClub();
  }, [resetSelectedGenre, resetSelectedLocation, resetSelectedOrder, resetSearchQuery, resetClickedClub]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <MapView filteredClubs={[]} />
    </div>
  );
}

export default VenuePage;

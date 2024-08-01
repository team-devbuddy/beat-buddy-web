'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchResultsProps } from '@/lib/types';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import NoResults from './NoResult';
import MapView from './Map/MapView';
import DropdownGroup from './DropdownGroup';
import MapButton from './Map/MapButton';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  likedClubsState,
  heartbeatNumsState,
  accessTokenState,
  isMapViewState,
  selectedGenreState,
  selectedLocationState,
  selectedOrderState,
  searchQueryState,
} from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { filterDropdown } from '@/lib/actions/search-controller/filterDropdown';
import { fetchVenues } from '@/lib/actions/search-controller/fetchVenues';

const genresMap: { [key: string]: string } = {
  힙합: 'HIPHOP',
  'R&B': 'R&B',
  테크노: 'TECHNO',
  EDM: 'EDM',
  하우스: 'HOUSE',
};

const locationsMap: { [key: string]: string } = {
  홍대: 'HONGDAE',
  이태원: 'ITAEWON',
  '강남/신사': 'GANGNAM/SINSA',
  압구정: 'APGUJEONG',
};

const criteriaMap: { [key: string]: string } = {
  '관련도 순': '관련도순',
  인기순: '인기순',
};

export default function SearchResults({ filteredClubs: initialFilteredClubs = [] }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [previousSearchQuery, setPreviousSearchQuery] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
  const [selectedOrder, setSelectedOrder] = useRecoilState(selectedOrderState);
  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);
  const resetSelectedOrder = useResetRecoilState(selectedOrderState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  const genres = ['힙합', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '강남/신사', '압구정'];
  const criteria = ['관련도순', '인기순'];

  const [filteredClubs, setFilteredClubs] = useState(initialFilteredClubs);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 로드 상태 추가

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  const fetchFilteredClubsByQuery = useCallback(async () => {
    if (searchQuery && searchQuery !== previousSearchQuery) {
      const clubs = await fetchVenues(searchQuery, accessToken);
      setFilteredClubs(clubs);
      setPreviousSearchQuery(searchQuery);
    }
  }, [searchQuery, accessToken, previousSearchQuery]);

  const fetchFilteredClubsByFilters = useCallback(async () => {
    if (isInitialLoad) {
      setIsInitialLoad(false); // 최초 로드 후 상태 변경
      return;
    }
    const filters = {
      keyword: searchQuery ? [searchQuery] : [],
      genreTag: genresMap[selectedGenre] || '',
      regionTag: locationsMap[selectedLocation] || '',
      sortCriteria: criteriaMap[selectedOrder] || '관련도순',
    };
    const clubs = await filterDropdown(filters, accessToken);
    setFilteredClubs(clubs);
  }, [searchQuery, selectedGenre, selectedLocation, selectedOrder, accessToken, isInitialLoad]);

  useEffect(() => {
    fetchFilteredClubsByQuery();
  }, [fetchFilteredClubsByQuery]);

  useEffect(() => {
    if (!isInitialLoad) {
      fetchFilteredClubsByFilters();
    }
  }, [fetchFilteredClubsByFilters]);

  useEffect(() => {
    setIsMapView(false);
  }, [setIsMapView]);

  useEffect(() => {
    setSelectedOrder('관련도순');
  }, [resetSelectedOrder, resetSelectedGenre, resetSelectedLocation]);

  return (
    <div className="relative flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {isMapView ? (
        <div key="map">
          <MapView filteredClubs={filteredClubs} />
        </div>
      ) : (
        <div key="list" className="flex flex-grow flex-col bg-BG-black">
          <DropdownGroup
            genres={genres}
            locations={locations}
            criteria={criteria}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
          {filteredClubs.length > 0 ? (
            <ClubList
              clubs={filteredClubs}
              likedClubs={likedClubs}
              heartbeatNums={heartbeatNums}
              handleHeartClickWrapper={handleHeartClickWrapper}
            />
          ) : (
            <NoResults />
          )}
        </div>
      )}

      {filteredClubs.length > 0 ? <MapButton /> : ''}
    </div>
  );
}

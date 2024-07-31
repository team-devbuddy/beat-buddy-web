'use client';

import React, { useState, useEffect } from 'react';
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
import { AnimatePresence, motion } from 'framer-motion';
import { transitionVariants } from '@/lib/animation';
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

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  const fetchFilteredClubs = async () => {
    if (!selectedGenre && !selectedLocation && !selectedOrder) {
      if (searchQuery) {
        const clubs = await fetchVenues(searchQuery, accessToken);
        setFilteredClubs(clubs);
      }
    } else {
      const filters = {
        keyword: searchQuery ? [searchQuery] : [],
        genreTag: genresMap[selectedGenre] || '',
        regionTag: locationsMap[selectedLocation] || '',
        sortCriteria: criteriaMap[selectedOrder] || '관련도순',
      };
      const clubs = await filterDropdown(filters, accessToken);
      setFilteredClubs(clubs);
    }
  };

  useEffect(() => {
    fetchFilteredClubs();
  }, [searchQuery]);

  useEffect(() => {
    fetchFilteredClubs();
  }, [selectedGenre, selectedLocation, selectedOrder]);

  useEffect(() => {
    setIsMapView(false);
  }, [setIsMapView]);

  // 컴포넌트가 처음 로드될 때 무조건 selectedOrder를 "관련도순"으로 설정
  useEffect(() => {
    setSelectedOrder('관련도순');
  }, []);

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

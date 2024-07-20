'use client';
import React, { useState, useEffect } from 'react';
import { SearchResultsProps } from '@/lib/types';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import MapButton from './MapButton';
import NoResults from './NoResult';
import MapView from './Map/MapView';
import DropdownGroup from './DropdownGroup';
import { useRecoilValue, useRecoilState } from 'recoil';
import { likedClubsState, heartbeatNumsState, accessTokenState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';

export default function SearchResults({ filteredClubs = [] }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useState(false);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const orders = ['가까운 순', '인기순'];

  const toggleViewMode = () => {
    setIsMapView((prev) => !prev);
  };

  return (
    <div className="relative flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {isMapView ? (
        <MapView filteredClubs={filteredClubs} />
      ) : (
        <div className="flex flex-col flex-grow bg-BG-black">
          <DropdownGroup
            genres={genres}
            locations={locations}
            orders={orders}
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
      {filteredClubs.length > 0 && <MapButton toggleViewMode={toggleViewMode} isMapView={isMapView} />}
    </div>
  );
}

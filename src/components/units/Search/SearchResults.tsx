'use client';
import React, { useState, useEffect } from 'react';
import { SearchResultsProps } from '@/lib/types';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import NoResults from './NoResult';
import MapView from './Map/MapView';
import DropdownGroup from './DropdownGroup';
import MapButton from './Map/MapButton'; // Import MapButton without props
import { useRecoilState, useRecoilValue } from 'recoil';
import { likedClubsState, heartbeatNumsState, accessTokenState, isMapViewState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { transitionVariants } from '@/lib/animation';

export default function SearchResults({ filteredClubs = [] }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState); 

  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const orders = ['가까운 순', '인기순'];

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 리스트 뷰가 표시되도록 설정
    setIsMapView(false);
  }, [setIsMapView]);

  return (
    <div className="relative flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AnimatePresence mode="wait">
        {isMapView ? (
          <motion.div
            key="map"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
          >
            <MapView filteredClubs={filteredClubs} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
            className="flex flex-col flex-grow bg-BG-black"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      <MapButton /> 
    </div>
  );
}

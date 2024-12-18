import React, { useState, useRef, useEffect } from 'react';
import { Club, SearchResultsProps } from '@/lib/types';
import BottomSheetComponent from './BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import type { BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import MapSearchButton from './MapSearchButton';
import SearchHeader from '../SearchHeader';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<{ filterAddressesInView: () => void } | null>(null);
  const [currentFilteredClubs, setCurrentFilteredClubs] = useState<Club[]>(filteredClubs);

  useEffect(() => {
    if (sheetRef.current) {
      console.log('BottomSheet is ready:', sheetRef.current);
    } else {
      console.error('BottomSheet ref is not assigned');
    }
  }, [sheetRef]);

  const handleSearch = (filteredClubsInView: Club[]) => {
    setCurrentFilteredClubs(filteredClubsInView);
  };

  useEffect(() => {
    setCurrentFilteredClubs(filteredClubs);
  }, [filteredClubs]);

  return (
    <>
      <SearchHeader  />
      <GoogleMap clubs={filteredClubs} minHeight="48.5rem" onAddressesInBounds={handleSearch} ref={mapRef} />
      <MapSearchButton onClick={() => mapRef.current?.filterAddressesInView()} />
      <BottomSheetComponent filteredClubs={currentFilteredClubs} />
    </>
  );
}

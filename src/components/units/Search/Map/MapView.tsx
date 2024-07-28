'use client';
import { SearchResultsProps, Club } from '@/lib/types';
import BottomSheetComponent from './BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import { useState, useRef, useEffect } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import type { BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import MapSearchButton from './MapSearchButton';

const testClubs: Club[] = [
  {
    venueId: 1,
    englishName: 'Club One',
    koreanName: '클럽 원',
    location: 'Seongnam-si, Jungwon-gu',
    tagList: ['hiphop'],
    logoUrl: '',
    address: '성남시 중원구 광명로 176',
    heartbeatNum: 100,
  },
  {
    venueId: 2,
    englishName: 'Club Two',
    koreanName: '클럽 투',
    location: 'Seongnam-si, Jungwon-gu',
    tagList: ['techno'],
    logoUrl: '',
    address: '성남시 중원구 시민로 66',
    heartbeatNum: 200,
  },
];

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<{ filterAddressesInView: () => void } | null>(null);
  const [currentFilteredClubs, setCurrentFilteredClubs] = useState<Club[]>(filteredClubs);

  const expandToFullHeight = () => {
    if (sheetRef.current) {
      sheetRef.current.snapTo(({ maxHeight }) => maxHeight);
    } else {
      console.error('BottomSheet ref is null');
    }
  };

  useEffect(() => {
    if (sheetRef.current) {
      console.log('BottomSheet is ready:', sheetRef.current);
    } else {
      console.error('BottomSheet ref is not assigned');
    }
  }, [sheetRef]);

  const handleSearch = (addressesInView: string[]) => {
    const filtered = filteredClubs.filter(club => addressesInView.includes(club.address ?? ''));
    setCurrentFilteredClubs(filtered);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-white">
      <div className="relative bg-[#131415]">
        <GoogleMap
          addresses={testClubs.map((club) => club.address ?? '')}
          minHeight="44rem"
          onAddressesInBounds={handleSearch}
          ref={mapRef}
        />
        <MapSearchButton onClick={() => mapRef.current?.filterAddressesInView()} />
      </div>
      <BottomSheetComponent filteredClubs={currentFilteredClubs} />
    </div>
  );
}

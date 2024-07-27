'use client';
import { SearchResultsProps } from '@/lib/types';
import BottomSheetComponent from './BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import { useRef, useEffect } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import type { BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);

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

  // address가 undefined가 아닌 클럽만 필터링
  const validAddresses = filteredClubs
    .map((club) => club.address)
    .filter((address) => address !== undefined) as string[];

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-white">
      <div className="bg-[#131415]">
        <GoogleMap addresses={validAddresses} minHeight="44rem" />
      </div>

      <BottomSheetComponent filteredClubs={filteredClubs} />
    </div>
  );
}

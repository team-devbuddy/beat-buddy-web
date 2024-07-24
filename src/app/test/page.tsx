'use client';

import BottomSheetComponent from '@/components/common/BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import { useRef, useEffect } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import type { BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

export default function TestPage() {
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

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-white">
      <div className="pb-32">
        <GoogleMap address="서울특별시 강남구 테헤란로 521" />
        <p className="text-white">경계</p>
      </div>

      <BottomSheetComponent />
    </div>
  );
}

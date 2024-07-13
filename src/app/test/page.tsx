'use client';

import GoogleMap from '@/components/common/GoogleMap';
import { useRef } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import type { BottomSheetRef } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

export default function TestPage() {
  const sheetRef = useRef<BottomSheetRef>(null);

  const expandToFullHeight = () => {
    if (sheetRef.current) {
      sheetRef.current.snapTo(({ maxHeight }) => maxHeight);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <div className="pb-32">
        <GoogleMap address="서울특별시 강남구 테헤란로 521" />
        <p className="text-white">경계</p>
        <BottomSheet open ref={sheetRef}>
          <div className="p-4">
            <button onClick={expandToFullHeight}>Expand to full height</button>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}

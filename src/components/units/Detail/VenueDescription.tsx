'use client';

import Image from 'next/image';
import { Club } from '@/lib/types';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';

interface VenueDescriptionProps {
  venue: Club;
}

export default function VenueDescription({ venue }: VenueDescriptionProps) {
  const description = venue.description || '';

  return (
    <div className="p-5">
      <p className="text-[1rem] mb-4 font-bold">About</p>

      <div className="flex flex-col gap-2 rounded-[0.75rem] bg-gray700 p-4 text-gray100">
        <p className="text-[0.875rem]">압구정 로데오 중심가에 자리해, 낮엔 브런치카페로, 밤엔 라운지바로 변신하는 복합문화 공간</p>
      </div>
    </div>
  );
}

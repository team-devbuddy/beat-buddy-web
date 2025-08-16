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
    <div className="px-5 pt-[0.88rem]">
      <p className="mb-2 text-body1-16-bold">About</p>
      <div className="flex flex-col gap-2 rounded-[0.75rem] bg-gray700 px-4 py-5 text-gray100">
        <p className="text-body-14-medium">{description}</p>
      </div>
    </div>
  );
}

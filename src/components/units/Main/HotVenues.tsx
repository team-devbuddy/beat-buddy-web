import React from 'react';
import { Club } from '@/lib/types';
import ClubsList from './ClubList';

interface HotVenuesProps {
  clubs: Club[];
  title?: string;
  description?: string;
}

function HotVenues({ clubs, title = 'Hot', description = '실시간으로 인기있는 베뉴 정보입니다.' }: HotVenuesProps) {
  return (
    <div className="mt-[1.5rem] flex flex-col">
      <div className="flex flex-col items-start justify-between px-[1rem] py-[0.5rem]">
        <span className="font-queensides text-lg text-main2">{title}</span>
        <span className="text-body2-15-medium text-gray200">{description}</span>
      </div>
      <ClubsList clubs={clubs} />
    </div>
  );
}

export default HotVenues;

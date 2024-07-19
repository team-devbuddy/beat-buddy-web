'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';

interface HeartbeatProps {
  venueId: number;
  venueName: string;
  venueImageUrl: string;
}

function Heartbeat() {
  const [heartbeats, setHeartbeats] = useState<HeartbeatProps[]>([]);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const getHeartbeats = async () => {
      try {
        if (accessToken) {
          const data = await getMyHearts(accessToken);
          setHeartbeats(data);
        }
      } catch (error) {
        console.error('Error fetching heartbeats:', error);
      }
    };

    getHeartbeats();
  }, [accessToken]);

  return (
    <div className="mt-[1.75rem] flex flex-col px-[1rem]">
      <Link href="/my-heartbeat">
        <div className="flex items-center justify-between py-[0.5rem]">
          <div className="flex flex-col">
            <span className="text-main-queen font-queensides text-main2">My Heart Beat</span>
            <div className="mt-[0.25rem] cursor-pointer text-body2-15-medium text-gray200">
              내가 관심있는 베뉴들의 정보를 확인하세요.
            </div>
          </div>
          <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
        </div>
      </Link>
      <div className="mt-[1.5rem] flex space-x-[0.75rem]">
        {heartbeats.map((heartbeat) => (
          <Link key={heartbeat.venueId} href={`/detail/${heartbeat.venueId}`}>
            <div className="relative h-16 w-16 cursor-pointer">
              <Image
                src={/*heartbeat.venueImageUrl*/ '/images/DefaultImage.png'}
                alt={`${heartbeat.venueName} image`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Heartbeat;

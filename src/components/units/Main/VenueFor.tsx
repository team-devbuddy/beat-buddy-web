'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { isBusinessState } from '@/context/recoil-context';
interface VenueForProps {
  userName: string | null;
}

export default function VenueFor({ userName }: VenueForProps) {
  const accessToken = useRecoilValue(accessTokenState);
  const isBusiness = useRecoilValue(isBusinessState);

  // 비즈니스 회원인 경우 이벤트 작성 페이지로, 일반 회원인 경우 BBP 리스트로
  const targetHref = isBusiness ? '/event/write' : '/bbp-list';

  return (
    <Link href={targetHref} passHref>
      {/* 그라디언트 테두리 */}
      <div
        className="cursor-pointer rounded-[0.5rem] p-[0.8px]"
        style={{
          background:
            'linear-gradient(90deg, #FF91C1 1%, #EE1171 25%, #FF91C1 50%, #92003F 75%, rgba(238, 23, 113, 0.05) 100%)',
        }}>
        {/* 기존 배경 유지 */}
        <div
          className="flex items-center justify-between rounded-[0.5rem] px-4 py-3"
          style={{
            background: `
              linear-gradient(90deg, rgba(23, 24, 28, 0.60) 60%, rgba(23, 24, 28, 0.40) 100%),
              radial-gradient(172.46% 137.71% at 97.31% 100%, #6D6EC3 12.02%, #EE1172 66.7%, #EE1172 100%)
            `,
            backgroundBlendMode: 'normal, normal',
          }}>
          <div className="flex flex-col justify-center gap-y-[0.13rem]">
            <div className="flex items-center gap-x-[0.25rem]">
              <Image src="/icons/bbpLogo.svg" alt="Arrow head right icon" width={16} height={15} />
              <span className="text-button-16-semibold text-[#FFCAE1]">
                {!isBusiness ? (
                  <>
                    Venue for <span className="font-bold">{userName}버디</span>
                  </>
                ) : (
                  'Drop the beat, Fill the floor'
                )}
              </span>
            </div>
            <span className="text-body-12-medium" style={{ color: 'rgba(255, 202, 225, 0.70)' }}>
              {!isBusiness ? '나에게 딱 맞는 베뉴들의 정보를 확인하세요!' : 'BeatBuddy에 나의 이벤트를 등록해보세요!'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getCouponState } from '@/lib/actions/venue-controller/getCouponState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, couponState } from '@/context/recoil-context';
import { receiveCoupon } from '@/lib/actions/venue-controller/receiveCoupon';

interface CouponInfo {
  couponId: number;
  couponName: string;
  couponDescription: string;
  [key: string]: any;
}

export default function CouponCard( { venueId }: { venueId: number }) {
  const accessToken = useRecoilValue(accessTokenState)||'';
  const coupon = useRecoilValue(couponState);
  const isExpired = !coupon?.isUsed && coupon?.isDownloaded && new Date() > new Date(coupon.expiredAt);
  const setCouponState = useSetRecoilState(couponState);

  const isUsed = coupon?.isUsed;
  const handleDownload = async () => {
    if (!coupon) return;
    const response = await receiveCoupon(accessToken, venueId, coupon.couponId);
    if (response === 201) {
      setCouponState({ ...coupon, isDownloaded: true });
    }
  };  
  const rightSectionBg = isExpired ? 'bg-gray500' : isUsed ? 'bg-sub1' : 'bg-gray700';

  const rightContent = isExpired ? (
    <span className="text-[0.75rem] font-medium text-white">쿠폰 만료</span>
  ) : isUsed || coupon?.isDownloaded ? (
    <span className="text-[0.75rem] font-medium text-white">쿠폰 사용</span>
  ) : (
    <button onClick={handleDownload} className="cursor-pointer" title="다운로드">
      <Image src="/icons/download.svg" alt="download" width={19} height={19} />
    </button>
  );


  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        if (!accessToken) return;
        const data = await getCouponState(accessToken);
        if (Array.isArray(data) && data.length > 0) {
          setCouponState(data[1]); // 서버에서 상태 받아와서 Recoil에 저장
        }
      } catch (error) {
        console.error('쿠폰 정보 가져오기 실패:', error);
      }
    };
  
    fetchCoupon();
  }, [accessToken, setCouponState]);
  if (!coupon) return null; // 쿠폰 없으면 렌더링 안 함

  return (
    <div className="px-5 pt-5">
      <div className="relative flex overflow-hidden rounded-[10px] border-none bg-gray700">
        {/* 왼쪽 컬러 포인트 */}
        <div className="absolute bottom-0 left-0 top-0 w-2 rounded-l-[10px] bg-sub1" />

        {/* 텍스트 영역 */}
        <div className="z-10 flex-1 py-[0.5rem] pl-5 pr-4">
          <p className="mb-[-3px] text-[0.75rem] font-medium text-main">{coupon.couponName}</p>
          <p className="text-[1rem] text-body1-16-bold text-gray100">{coupon.couponDescription}</p>
        </div>

        {/* 우측 아이콘 영역 */}
        <div className={`relative z-10 flex w-[60px] items-center justify-center border-none ${rightSectionBg}`}>
          {/* 점선 */}
          <div className="absolute bottom-0 left-0 top-0 border-l-[1px] border-dashed border-sub1" />

          {/* 위 notch */}
          <svg
            className="absolute -left-[3px] bottom-[-7px] z-20"
            width="30"
            height="20"
            viewBox="0 0 30 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12C1.2 12 0.8 11.2 1.1 10.5L3 5C3.3 4.2 4.7 4.2 5 5L6.9 10.5C7.2 11.2 6.8 12 6 12H2Z"
              fill="#17181C"
            />
          </svg>

          {/* 아래 notch */}
          <svg
            className="absolute -left-[25px] top-[-7px] z-20 rotate-180"
            width="30"
            height="20"
            viewBox="0 0 30 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12C1.2 12 0.8 11.2 1.1 10.5L3 5C3.3 4.2 4.7 4.2 5 5L6.9 10.5C7.2 11.2 6.8 12 6 12H2Z"
              fill="#17181C"
            />
          </svg>

          {/* 다운로드 아이콘 */}
          {rightContent}
        </div>
      </div>
    </div>
  );
}

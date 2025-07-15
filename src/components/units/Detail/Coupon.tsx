'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getCouponState } from '@/lib/actions/venue-controller/getCouponState';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface CouponInfo {
  couponId: number;
  couponName: string;
  couponDescription: string;
  [key: string]: any;
}

export default function CouponCard() {
  const accessToken = useRecoilValue(accessTokenState);
  const [coupon, setCoupon] = useState<CouponInfo | null>(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        if (!accessToken) return;
        const data = await getCouponState(accessToken);
        if (Array.isArray(data) && data.length > 0) {
          setCoupon(data[0]); // 첫 번째 쿠폰 사용
        }
      } catch (error) {
        console.error('쿠폰 정보 가져오기 실패:', error);
      }
    };

    fetchCoupon();
  }, [accessToken]);

  if (!coupon) return null; // 쿠폰 없으면 렌더링 안 함

  return (
    <div className="relative flex overflow-hidden rounded-[10px] border-none bg-gray700">
      {/* 왼쪽 컬러 포인트 */}
      <div className="absolute bottom-0 left-0 top-0 w-2 rounded-l-[10px] bg-sub1" />

      {/* 텍스트 영역 */}
      <div className="z-10 flex-1 py-[0.53rem] pl-5 pr-4">
        <p className="mb-1 text-[0.75rem] font-medium text-main">{coupon.couponName}</p>
        <p className="text-[1rem] font-bold leading-none text-gray100">{coupon.couponDescription}</p>
      </div>

      {/* 우측 아이콘 영역 */}
      <div className="relative z-10 flex w-[60px] items-center justify-center border-none bg-gray700">
        {/* 점선 */}
        <div className="absolute bottom-0 left-0 top-0 border-l-2 border-dashed border-sub1" />

        {/* 위 notch */}
        <svg
          className="absolute -left-[3px] bottom-[-7px] z-20"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 12C1.2 12 0.8 11.2 1.1 10.5L3 5C3.3 4.2 4.7 4.2 5 5L6.9 10.5C7.2 11.2 6.8 12 6 12H2Z"
            fill="#1C1C1C"
          />
        </svg>

        {/* 아래 notch */}
        <svg
          className="absolute -left-[15px] top-[-7px] z-20 rotate-180"
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 12C1.2 12 0.8 11.2 1.1 10.5L3 5C3.3 4.2 4.7 4.2 5 5L6.9 10.5C7.2 11.2 6.8 12 6 12H2Z"
            fill="#1C1C1C"
          />
        </svg>

        {/* 다운로드 아이콘 */}
        <Image src="/icons/download.svg" alt="download" width={19} height={19} />
      </div>
    </div>
  );
}

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

export default function CouponCard({ venueId }: { venueId: number }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const coupon = useRecoilValue(couponState);
  const isExpired = !coupon?.isUsed && coupon?.isDownloaded && new Date() > new Date(coupon.expiredAt);
  const setCouponState = useSetRecoilState(couponState);

  const isUsed = coupon?.isUsed;
  const handleDownload = async () => {
    if (!coupon) return;

    try {
      console.log('쿠폰 다운로드 시도:', { venueId, couponId: coupon.couponId });
      const response = await receiveCoupon(accessToken, venueId, coupon.couponId);

      if (response === 201) {
        console.log('쿠폰 다운로드 성공');
        setCouponState({ ...coupon, isDownloaded: true });
      } else {
        console.error('쿠폰 다운로드 실패:', response);
      }
    } catch (error) {
      console.error('쿠폰 다운로드 에러:', error);
    }
  };

  // 쿠폰 상태에 따른 배경 이미지 결정
  const getCouponBackground = () => {
    // 항상 coupon_download.svg 사용
    return '/coupon_download.svg';
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
        const data = await getCouponState(accessToken, venueId);
        console.log('쿠폰 상태 데이터:', data);

        if (Array.isArray(data) && data.length > 0) {
          // 서버에서 받아온 쿠폰 데이터로 상태 초기화
          const couponData = data.find((item) => item.venueId === venueId) || data[0];
          setCouponState(couponData);
        } else if (data && typeof data === 'object') {
          // 단일 쿠폰 객체인 경우
          setCouponState(data);
        } else {
          // 쿠폰이 없는 경우
          setCouponState(null);
        }
      } catch (error) {
        console.error('쿠폰 정보 가져오기 실패:', error);
        setCouponState(null);
      }
    };

    fetchCoupon();
  }, [accessToken, setCouponState, venueId]);

  // 쿠폰이 없으면 컴포넌트 자체를 렌더링하지 않음
  if (!coupon) return null;

  return (
    <div className="px-5 ">
      <div className="relative">
        <Image src={getCouponBackground()} alt="coupon" width={335} height={68} />

        {/* 쿠폰 내용 오버레이 */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {/* 왼쪽 텍스트 영역 */}
          <div className="flex flex-col">
            <span className="text-[0.75rem] font-medium leading-tight text-main">{coupon.couponName}</span>
            <span className="mt-[-0.12rem] text-[1rem] font-bold leading-tight text-gray100">
              {coupon.couponDescription}
            </span>
          </div>

          {/* 우측 버튼 영역 */}
          <div className="flex items-center">
            {isExpired ? (
              <div className="flex items-center">
                <span className="ml-1 text-[0.75rem] font-medium text-gray400">사용만료</span>
              </div>
            ) : isUsed ? (
              <div className="flex items-center">
                <span className="ml-1 text-[0.75rem] font-medium text-sub1">쿠폰 사용</span>
              </div>
            ) : (
              <button
                onClick={handleDownload}
                className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-opacity-80"
                title="다운로드">
                <Image src="/icons/download.svg" alt="download" width={16} height={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

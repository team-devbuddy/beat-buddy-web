'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getMyAvailableCoupon } from '@/lib/actions/user-controller/getMyAvailableCoupon';
import { getMyDisavailableCoupon } from '@/lib/actions/user-controller/getMyDisavailableCoupon';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import NoResults from '@/components/units/Search/NoResult';
interface CouponData {
  memberCouponId: number;
  couponId: number;
  memberId: number;
  couponName: string;
  couponContent: string;
  howToUse: string;
  venueName: string;
  receivedDate: string;
  usedDate: string | null;
  expirationDate: string;
  status: 'RECEIVED' | 'USED' | 'EXPIRED';
}

export default function CouponPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'expired'>('available');
  const accessToken = useRecoilValue(accessTokenState);

  const [availableCoupons, setAvailableCoupons] = useState<CouponData[]>([]);
  const [expiredCoupons, setExpiredCoupons] = useState<CouponData[]>([]);

  // UI 확인을 위한 더미데이터
  const dummyAvailableCoupons: CouponData[] = [
    {
      memberCouponId: 1,
      couponId: 1,
      memberId: 156,
      couponName: 'OUF 2025 사전 예약',
      couponContent: '주류 20% 할인 쿠폰',
      howToUse: '우리한테 보여주세여',
      venueName: '클럽 트립',
      receivedDate: '2025-07-08T23:43:08.28746',
      usedDate: null,
      expirationDate: '2025-07-13',
      status: 'RECEIVED',
    },
    {
      memberCouponId: 2,
      couponId: 2,
      memberId: 156,
      couponName: 'CLUB TRIP 할인',
      couponContent: '입장료 30% 할인 쿠폰',
      howToUse: '우리한테 보여주세여',
      venueName: '클럽 트립',
      receivedDate: '2025-07-08T23:43:08.28746',
      usedDate: null,
      expirationDate: '2025-08-15',
      status: 'RECEIVED',
    },
  ];

  const dummyExpiredCoupons: CouponData[] = [
    {
      memberCouponId: 3,
      couponId: 3,
      memberId: 156,
      couponName: '봄맞이 이벤트',
      couponContent: '음료 무료 쿠폰',
      howToUse: '우리한테 보여주세여',
      venueName: '클럽 트립',
      receivedDate: '2025-03-01T00:00:00.00000',
      usedDate: null,
      expirationDate: '2025-03-31',
      status: 'EXPIRED',
    },
    {
      memberCouponId: 4,
      couponId: 4,
      memberId: 156,
      couponName: '여름 특별 할인',
      couponContent: '전체 메뉴 15% 할인',
      howToUse: '우리한테 보여주세여',
      venueName: '클럽 트립',
      receivedDate: '2025-06-01T00:00:00.00000',
      usedDate: '2025-06-15T00:00:00.00000',
      expirationDate: '2025-06-30',
      status: 'USED',
    },
  ];

  useEffect(() => {
    
    if (accessToken) {
      getMyAvailableCoupon(accessToken).then((data) => {
        if (data?.code === 'SUCCESS_BUT_EMPTY_LIST') {
          setAvailableCoupons([]);
        } else if (data?.data?.coupons) {
          setAvailableCoupons(data.data.coupons);
        } else {
          setAvailableCoupons([]);
        }
      });
      getMyDisavailableCoupon(accessToken).then((data) => {
        if (data?.code === 'SUCCESS_BUT_EMPTY_LIST') {
          setExpiredCoupons([]);
        } else if (data?.data?.coupons) {
          setExpiredCoupons(data.data.coupons);
        } else {
          setExpiredCoupons([]);
        }
      });
    }
    
  }, [accessToken]);

  const currentCoupons = activeTab === 'available' ? availableCoupons : expiredCoupons;

  const handleBackClick = () => {
    router.back();
  };

  const handleCouponClick = (coupon: CouponData) => {
    console.log('쿠폰 클릭:', coupon);
  };

  return (
    <div className="bg-BG-black">
      {/* 헤더 */}
      <header className="flex flex-col bg-BG-black px-[1.25rem]">
        <div className="flex w-full items-center py-[0.62rem]">
          <div onClick={handleBackClick} className="flex items-start">
            <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} />
          </div>
          <div className="flex w-full items-center justify-between">
            <span className="text-subtitle-20-bold text-white">My Coupon</span>
          </div>
        </div>
      </header>

      {/* 탭바 */}
      <div className="relative flex">
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-4 text-center text-body-15-medium ${
            activeTab === 'available' ? 'font-bold text-main' : 'text-gray200'
          }`}>
          사용 가능한 쿠폰
        </button>
        <button
          onClick={() => setActiveTab('expired')}
          className={`flex-1 py-4 text-center text-body-15-medium ${
            activeTab === 'expired' ? 'font-bold text-main' : 'text-gray200'
          }`}>
          만료된 쿠폰
        </button>

        {/* 밑줄 애니메이션 */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-[2px] w-1/2 bg-main"
          style={{
            left: activeTab === 'available' ? '0%' : '50%',
          }}
        />
      </div>

      {/* 쿠폰 목록 */}
      <div className="px-5 py-5">
        {currentCoupons.length === 0 ? (
          <NoResults
            text={activeTab === 'available' ? '사용 가능한 쿠폰이 없어요' : '만료된 쿠폰이 없어요'}
            fullHeight
          />
        ) : (
          <div className="space-y-4">
            {currentCoupons.map((coupon) => (
              <div
                key={coupon.memberCouponId}
                onClick={() => handleCouponClick(coupon)}
                className={`cursor-pointer rounded-xl`}>
                {/* 쿠폰 컨테이너 */}
                <div className="relative w-full" style={{ height: '6.5rem' }}>
                  {/* 왼쪽(가변) 레이어 */}
                  <div
                    className="absolute inset-y-0 left-0"
                    style={{
                      right: 79, // 고정된 오른쪽 폭
                    }}
                    aria-hidden>
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <image
                        href={
                          coupon.status === 'EXPIRED'
                            ? '/icons/mypage-disavailable-coupon-left.svg'
                            : coupon.status === 'USED'
                              ? '/icons/mypage-disavailable-coupon-left.svg'
                            : '/icons/mypage-available-coupon-left.svg'
                        }
                        width="100%"
                        height="100%"
                        preserveAspectRatio="none"
                      />
                    </svg>
                  </div>

                  {/* 오른쪽(고정) 레이어 */}
                  <div className="absolute inset-y-0 right-0" style={{ width: 79 }} aria-hidden>
                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <image
                        href={
                          coupon.status === 'EXPIRED'
                            ? '/icons/mypage-expired-coupon-right.svg'
                            : coupon.status === 'USED'
                              ? '/icons/mypage-used-coupon-right.svg'
                              : '/icons/mypage-available-coupon-right.svg'
                        }
                        width="100%"
                        height="100%"
                        preserveAspectRatio="none"
                      />
                    </svg>
                  </div>

                  {/* 내용 오버레이 */}
                  <div
                    className="absolute inset-0 flex items-center justify-between px-[1.31rem] py-[0.88rem]"
                    style={{ paddingRight: Math.max(12, 79 + 8) }}>
                    {/* 왼쪽 텍스트 */}
                    <div className="flex flex-col gap-y-1">
                      <span className="text-button-bold text-white">{coupon.couponName}</span>
                      <span className="text-body-12-medium text-gray200">{coupon.expirationDate}까지</span>
                    </div>

                    {/* 오른쪽 액션 */}
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

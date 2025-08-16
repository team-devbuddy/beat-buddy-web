'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getCouponState } from '@/lib/actions/venue-controller/getCouponState';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, couponState } from '@/context/recoil-context';
import { receiveCoupon } from '@/lib/actions/venue-controller/receiveCoupon';
import { Sheet } from 'react-modal-sheet';
import { useCoupon } from '@/lib/actions/venue-controller/useCoupon';
import { useParams } from 'next/navigation';
import { fetchClubDetail } from '@/lib/actions/detail-controller/fetchClubDetail';

interface CouponInfo {
  couponId: number;
  couponName: string;
  couponDescription: string;
  expireDate: string;
  quota: number;
  remaining: number;
  policy: string;
  howToUse: string;
  notes: string;
  maxQuota: number;
  receivedCount: number;
  received: boolean;
  soldOut: boolean;
  isUsed?: boolean; // 사용 여부 추가
  [key: string]: any;
}

export default function CouponCard({ venueId }: { venueId: number }) {
  const params = useParams();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const coupon = useRecoilValue(couponState);
  const [showDownloadSheet, setShowDownloadSheet] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [isUsing, setIsUsing] = useState(false);

  // 쿠폰 상태 확인
  const isExpired = coupon?.expireDate && new Date() > new Date(coupon.expireDate);
  const isSoldOut = coupon?.soldOut;
  const isReceived = coupon?.received;
  const isUsed = coupon?.isUsed;
  const expireDate = coupon?.expireDate?.split('-').join('.');

  const setCouponState = useSetRecoilState(couponState);
  const [clubDetail, setClubDetail] = useState<any>(null);

  const handleDownloadClick = () => {
    if (!coupon || isReceived || isSoldOut || isExpired) return;
    setShowDownloadSheet(true);
  };

  const handleDownload = async () => {
    if (!coupon || isReceived || isSoldOut || isExpired) return;

    try {
      console.log('쿠폰 다운로드 시도:', { venueId, couponId: coupon.couponId });
      const response = await receiveCoupon(accessToken, venueId, coupon.couponId);

      if (response === 201) {
        console.log('쿠폰 다운로드 성공');
        setCouponState({ ...coupon, received: true, receivedCount: (coupon.receivedCount || 0) + 1 });
        setShowDownloadSheet(false);
      } else {
        console.error('쿠폰 다운로드 실패:', response);
      }
    } catch (error) {
      console.error('쿠폰 다운로드 에러:', error);
    }
  };

  const handleCouponClick = () => {
    // 받은 쿠폰이고 만료되지 않았으며 사용하지 않은 경우에만 직원 확인 모달 표시
    if (isReceived && !isExpired && !isUsed) {
      setShowStaffModal(true);
    }
  };

  const handleStaffConfirm = () => {
    setShowStaffModal(false);
    setShowUsageModal(true);
  };

  const handleUseCoupon = async () => {
    if (!coupon || isUsing) return;

    setIsUsing(true);
    try {
      console.log('쿠폰 사용 시도:', coupon.couponId);
      const response = await useCoupon(accessToken, coupon.couponId);

      if (response) {
        console.log('쿠폰 사용 성공');
        setCouponState({ ...coupon, isUsed: true });
        setShowUsageModal(false);
      }
    } catch (error) {
      console.error('쿠폰 사용 실패:', error);
      alert('쿠폰 사용에 실패했습니다. 다시 시도해주세요');
    } finally {
      setIsUsing(false);
    }
  };

  // 쿠폰 상태에 따른 배경 이미지 결정 (좌우 짝꿍 SVG)
  const getCouponBackground = () => {
    if (isExpired || isUsed || isSoldOut) {
      // 만료/사용/품절된 쿠폰
      return {
        left: '/coupon-disavailable-left.svg',
        right: '/coupon-disavailable-right.svg',
      };
    } else if (isReceived) {
      // 받은 쿠폰 (사용 가능)
      return {
        left: '/coupon-use-available-left.svg',
        right: '/coupon-use-available-right.svg',
      };
    } else {
      // 다운로드 가능한 쿠폰
      return {
        left: '/coupon-download-available-left.svg',
        right: '/coupon-download-available-right.svg',
      };
    }
  };
  // 파일 상단 근처에 상수/상태 추가
  const COUPON_HEIGHT = 68; // 디자인 고정 높이
  const DEFAULT_RIGHT_WIDTH = 112; // 초기값(대략치)
  const [rightWidth, setRightWidth] = useState<number>(DEFAULT_RIGHT_WIDTH);

  const sprites = getCouponBackground(); // { left, right }

  // 이미지 로드 후 오른쪽 실제 px 폭 계산
  const handleRightLoaded = ({ naturalWidth, naturalHeight }: { naturalWidth: number; naturalHeight: number }) => {
    const w = Math.round((COUPON_HEIGHT * naturalWidth) / naturalHeight);
    if (Number.isFinite(w) && w > 0) setRightWidth(w);
  };

  // 우측 버튼 영역 내용 결정
  const getRightContent = () => {
    if (isExpired) {
      return <div className="flex items-center"></div>;
    } else if (isUsed) {
      return <div className="flex items-center"></div>;
    } else if (isSoldOut) {
      return <div className="flex items-center"></div>;
    } else if (isReceived) {
      return <div className="flex items-center"></div>;
    } else {
      return (
        <button
          onClick={handleDownloadClick}
          className="cursor-pointer rounded-full bg-transparent p-2 transition-all hover:bg-opacity-80"
          title="다운로드">
          <Image src="/icons/download.svg" alt="download" width={16} height={16} />
        </button>
      );
    }
  };

  useEffect(() => {
    const fetchClubName = async () => {
      try {
        console.log('클럽 정보 조회 시도:', { id: params.id, accessToken: !!accessToken });
        const response = await fetchClubDetail(params.id as string, accessToken);
        console.log('클럽 정보 응답:', response);
        setClubDetail(response.venue || response); // venue 또는 전체 응답 사용
      } catch (error) {
        console.error('클럽 정보 조회 실패:', error);
      }
    };

    if (params.id && accessToken) {
      fetchClubName();
    }
  }, [params.id, accessToken]);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        if (!accessToken) return;
        const response: any = await getCouponState(accessToken, venueId);
        console.log('쿠폰 상태 데이터:', response);

        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          // 첫 번째 쿠폰 데이터 사용
          const couponData = response.data[0];
          setCouponState(couponData);
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
    <div className="w-full">
      <div className="px-5 pb-[0.88rem]">
        {/* ⬇️ 여기부터 기존 grid 블록 전체를 이 블록으로 교체 */}
        <div className={`relative ${isReceived && !isExpired ? 'cursor-pointer' : ''}`} onClick={handleCouponClick}>
          {/* 쿠폰 컨테이너 */}
          <div className="relative w-full" style={{ height: COUPON_HEIGHT }}>
            {/* 왼쪽(가변) 레이어: 오른쪽 폭만큼 비워두고 전부 채움 */}
            <div
              className="absolute inset-y-0 left-0"
              style={{
                right: rightWidth, // ← 핵심
              }}
              aria-hidden>
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <image href={sprites.left} width="100%" height="100%" preserveAspectRatio="none" />
              </svg>
            </div>

            {/* 오른쪽(고정) 레이어: 실제 비율대로 폭 고정 */}
            <div className="absolute inset-y-0 right-0" style={{ width: rightWidth }} aria-hidden>
              <Image
                src={sprites.right}
                alt="coupon-right"
                fill
                style={{ objectFit: 'contain' }}
                priority
                onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                  handleRightLoaded({ naturalWidth, naturalHeight })
                }
              />
            </div>

            {/* 내용 오버레이: 오른쪽 폭만큼 패딩 확보 */}
            <div
              className="absolute inset-0 flex items-center justify-between px-4"
              style={{ paddingRight: Math.max(12, rightWidth + 8) }}>
              {/* 왼쪽 텍스트 */}
              <div className="flex flex-col">
                <span className="text-[0.75rem] font-medium leading-tight text-main">{coupon.couponName}</span>
                <span className="mt-[-0.12rem] text-[1rem] font-bold leading-[160%] text-gray100">
                  {coupon.couponDescription}
                </span>
              </div>

              {/* 오른쪽 액션 */}
              <div className="flex items-center">{getRightContent()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 쿠폰 다운로드 바텀시트 showDownloadSheet*/}
      <Sheet isOpen={showDownloadSheet} onClose={() => setShowDownloadSheet(false)} snapPoints={[400]} initialSnap={0}>
        <Sheet.Container className="!bg-BG-black">
          <Sheet.Header className="!bg-BG-black">
            <div className="flex justify-center py-3"></div>
          </Sheet.Header>
          <Sheet.Content className="!bg-BG-black px-5 pb-8">
            <div className="flex flex-col items-center space-y-6">
              {/* 쿠폰 정보 */}
              <div className="w-full">
                <div className="flex flex-col items-start">
                  <div className="relative mb-3 flex w-full items-center justify-center">
                    <p className="text-[0.75rem] text-gray200">
                      {clubDetail?.englishName || clubDetail?.koreanName || '클럽'}
                    </p>
                    <Image
                      className="absolute right-0 cursor-pointer"
                      src="/icons/XmarkWhite.svg"
                      alt="close"
                      width={10}
                      height={10}
                      onClick={() => setShowDownloadSheet(false)}
                    />
                  </div>
                  <div className="mb-3 flex w-full flex-col items-start rounded-[0.75rem] bg-gray700 px-6 py-5 text-start">
                    <h3 className="text-[1rem] text-main">{coupon?.couponName}</h3>
                    <p className="text-[1.25rem] font-bold text-white">
                      {clubDetail?.englishName || clubDetail?.koreanName || '클럽'}
                    </p>
                    <p className="text-[1.25rem] font-bold text-white">{coupon?.couponDescription}</p>
                  </div>
                  <div className="flex flex-row items-center gap-x-1">
                    <p className="text-[0.75rem] text-gray300">유효기간: </p>
                    <p className="text-[0.75rem] text-main">{expireDate} 까지 사용가능</p>
                  </div>
                  <p className="text-[0.75rem] text-gray300">{coupon?.notes}</p>
                  <p className="text-[0.75rem] text-gray300">{coupon?.howToUse}</p>
                  <p className="text-[0.75rem] text-gray300">{coupon?.policy}</p>
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="flex w-full">
                <button
                  onClick={handleDownload}
                  disabled={isUsing}
                  className="flex-1 rounded-lg bg-main py-[0.99rem] text-[0.9935rem] font-bold text-sub2 disabled:bg-gray600 disabled:text-gray400">
                  쿠폰 다운로드
                </button>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
      {/* 직원 확인 모달 */}
      {showStaffModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black bg-opacity-70 p-5"
            onClick={() => setShowStaffModal(false)}>
            {/* 모달 본체 */}
            <div className="w-full max-w-sm rounded-[0.75rem] bg-BG-black p-5" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center">
                <h3 className="text-[1rem] text-main">{coupon?.couponName}</h3>
                <p className="mb-3 text-[1.25rem] font-bold text-white">{coupon?.couponDescription}</p>
                <p className="mb-3 text-[0.875rem] text-gray300">{coupon?.howToUse}</p>
                <p className="mb-3 text-[0.75rem] text-gray200">{expireDate} 까지</p>
                <div className="bg-gray800 w-full rounded-lg p-3"></div>

                <button
                  onClick={handleStaffConfirm}
                  className="w-full rounded-lg bg-gray700 py-3 text-[0.9935rem] font-bold text-main">
                  직원 확인
                </button>
              </div>
            </div>

            {/* ✅ 모달 바로 아래에 붙는 안내 텍스트 */}
            <div className="text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-[0.875rem] text-main">직원확인 버튼 클릭 시 쿠폰이 즉시 사용 처리됩니다.</p>
              <p className="text-[0.875rem] text-main">직원만 확인을 눌러주세요</p>
            </div>
          </div>,
          document.body,
        )}

      {/* 쿠폰 사용 확인 모달 */}
      {showUsageModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setShowUsageModal(false)}>
            <div
              className="mx-5 max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-[0.75rem] bg-BG-black px-5 pb-4 pt-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center">
                <h3 className="mb-2 text-[1.125rem] font-bold text-white">쿠폰을 사용하시겠습니까?</h3>
                <p className="mb-5 text-center text-[0.875rem] text-gray300">
                  직원확인 버튼 클릭시 쿠폰이 즉시 사용 처리되며,
                  <br />
                  되돌릴 수 없습니다.
                </p>

                {/* 버튼 영역 */}
                <div className="flex w-full space-x-3">
                  <button
                    onClick={() => setShowUsageModal(false)}
                    className="flex-1 rounded-[0.5rem] bg-gray700 py-[0.66rem] text-[0.9935rem] font-bold text-gray200">
                    취소
                  </button>
                  <button
                    onClick={handleUseCoupon}
                    disabled={isUsing}
                    className="flex-1 rounded-[0.5rem] bg-gray700 py-[0.66rem] text-[0.9935rem] font-bold text-main disabled:bg-gray600 disabled:text-gray400">
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

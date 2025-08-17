'use client';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { GetNickname } from '@/lib/action';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';
import BusinessMyPage from './BusinessMyPage';
import { useRouter, useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { GetPreference } from '@/lib/actions/user-controller/getPreference';
import 'swiper/css';
import 'swiper/css/pagination';

export default function MyPageComponent() {
  const access = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const setUserProfile = useSetRecoilState(userProfileState);
  const [nickname, setNickname] = useState('');
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [preference, setPreference] = useState<any>(null);

  // ▼ 쿠폰 카드 레이아웃 상수/상태 (오른쪽 조각 실제 폭 계산)
  const COUPON_HEIGHT = 68; // 디자인 고정 높이
  const DEFAULT_RIGHT_WIDTH = 112; // 초기 대략치(SSR 안정화)
  const [rightWidth, setRightWidth] = useState<number>(DEFAULT_RIGHT_WIDTH);

  // 사용 중인 스킨(필요 시 상태에 따라 교체 가능)
  const leftSprite = '/coupon-disavailable-left.svg';
  const rightSprite = '/coupon-disavailable-right.svg';

  const handleRightLoaded = ({ naturalWidth, naturalHeight }: { naturalWidth: number; naturalHeight: number }) => {
    const w = Math.round((COUPON_HEIGHT * naturalWidth) / naturalHeight);
    if (Number.isFinite(w) && w > 0) setRightWidth(w);
  };

  // 영어 태그를 한글로 변환하는 함수
  const translateTag = (tag: string): string => {
    const tagMap: { [key: string]: string } = {
      ROCK: '락',
      ROOFTOP: '루프탑',
      ITAEWON: '이태원',
      HONGDAE: '홍대',
      'GANGNAM/SINSA': '강남/신사',
      APGUJEONG: '압구정로데오',
      OTHERS: '기타',
      CLUB: '클럽',
      PUB: '펍',
      HIPHOP: '힙합',
      EDM: 'EDM',
      LATIN: '라틴',
      'K-POP': 'K-POP',
      POP: 'POP',
      DEEP: '딥한',
      COMMERCIAL: '커머셜한',
      CHILL: '칠한',
      EXOTIC: '이국적인',
      HUNTING: '헌팅',
      'BAR&CAFE': 'BAR&CAFE',
      'SOUL&FUNK': 'SOUL&FUNK',
      'R&B': 'R&B',
      TECHNO: '테크노',
      HOUSE: '하우스',
    };
    return tagMap[tag] || tag;
  };
  // 사용자 타입 확인
  const isBusiness = userProfile?.role === 'BUSINESS';

  // 비즈니스 회원인 경우 비즈니스 마이페이지 렌더링
  if (isBusiness) {
    return <BusinessMyPage />;
  }

  // 문의사항 모달 핸들러
  const handleInquiryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowInquiryModal(true);
  };

  const handleContactMethod = (method: string) => {
    switch (method) {
      case 'kakao':
        window.open('http://pf.kakao.com.', '_blank');
        break;
      case 'instagram':
        window.open('https://www.instagram.com/beatbuddy.kr', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:beatbuddykr@gmail.com';
        break;
    }
    setShowInquiryModal(false);
  };

  // URL 쿼리 파라미터에서 닉네임 변경 감지 및 userProfileState 업데이트
  useEffect(() => {
    const updatedNickname = searchParams.get('nickname');
    if (updatedNickname && userProfile) {
      setUserProfile({
        ...userProfile,
        nickname: updatedNickname,
      });
    }
  }, [searchParams, userProfile, setUserProfile]);

  // userProfileState가 변경될 때마다 닉네임 동기화
  useEffect(() => {
    if (userProfile?.nickname && userProfile.nickname !== nickname) {
      setNickname(userProfile.nickname);
    }
  }, [userProfile?.nickname, nickname]);

  // 사용자 닉네임 조회 & 나의 하트비트 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        // GetPreference API 호출 (독립적으로)
        console.log('Calling GetPreference API...');
        try {
          const preferenceResponse = await GetPreference(access);
          console.log('GetPreference response:', preferenceResponse);
          if (preferenceResponse && Array.isArray(preferenceResponse)) {
            console.log('Setting preference state:', preferenceResponse);
            setPreference(preferenceResponse);
          } else {
            console.log('Preference response is invalid:', preferenceResponse);
          }
        } catch (error) {
          console.error('Error fetching preference:', error);
        }

        // 다른 API들 호출
        const response = await GetNickname(access);

        if (response.ok) {
          const responseJson = await response.json();

          setNickname(responseJson.nickname);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [access]);

  return (
    <>
      <div className="flex flex-col">
        {/* 프로필 스와이퍼 */}
        <div className="w-full overflow-hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1.045}
            centeredSlides={false}
            pagination={false}
            className="profile-swiper"
            style={
              {
                '--swiper-pagination-color': 'transparent',
                '--swiper-pagination-bullet-inactive-color': 'transparent',
              } as React.CSSProperties
            }>
            {/* 첫 번째 프로필 카드 - 마이페이지 프로필 */}
            <SwiperSlide>
              <div
                className="mb-[0.62rem] ml-5 mr-1 mt-5 rounded-[0.625rem] p-5"
                style={{
                  background:
                    userProfile?.role === 'BUSINESS'
                      ? `radial-gradient(127.07% 71.54% at 0% 82.92%, rgba(210, 30, 30, 0.50) 0%, rgba(210, 30, 30, 0.00) 100%), radial-gradient(72.73% 59.06% at 97.01% 32.92%, rgba(255, 0, 68, 0.50) 0%, rgba(255, 0, 68, 0.10) 100%), radial-gradient(44.88% 90.82% at 46.12% -18.01%, rgba(255, 0, 17, 0.50) 0%, rgba(255, 0, 17, 0.00) 100%), rgba(40, 41, 42, 1)`
                      : `radial-gradient(127.07% 71.54% at 0% 82.92%, rgba(238, 17, 113, 0.50) 0%, rgba(34, 0, 255, 0) 100%), radial-gradient(72.73% 59.06% at 97.01% 32.92%, rgba(238, 17, 113, 0.50) 0%, rgba(238, 17, 113, 0.10) 100%), radial-gradient(44.88% 90.82% at 46.12% -18.01%, rgba(238, 17, 113, 0.50) 0%, rgba(238, 17, 113, 0.00) 100%), rgba(40, 41, 42, 1)`,
                }}>
                <div className="flex h-full flex-col justify-between">
                  {/* 프로필 정보 */}
                  <div
                    className={`${userProfile?.role === 'BUSINESS' ? 'mb-[1.56rem]' : 'mb-[1.12rem]'} flex items-start justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray700">
                        <Image
                          src={userProfile?.profileImageUrl || '/icons/mypage-profile.svg'}
                          alt="프로필"
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                          style={{ aspectRatio: '1/1' }}
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-button-bold text-white">
                            {userProfile?.role === 'BUSINESS'
                              ? userProfile?.businessName
                              : userProfile?.nickname || nickname}
                          </span>
                          <Image
                            onClick={() => router.push(`/mypage/manage`)}
                            src="/icons/Frame 60.svg"
                            alt="편집"
                            width={14}
                            height={14}
                          />
                        </div>
                        <span className="text-body3-12-medium text-white/70">
                          {userProfile?.role === 'BUSINESS' ? '비즈니스 회원' : '일반 회원'}
                        </span>
                      </div>
                    </div>
                    <button className="rounded-[0.5rem] bg-white/20 px-2 pb-[0.25rem] pt-[0.19rem] text-body-11-medium text-white/80">
                      메인 프로필
                    </button>
                  </div>

                  {/* 내 취향 태그 또는 주최이벤트 관리 */}
                  {userProfile?.role === 'BUSINESS' ? (
                    <div className="">
                      <div className="flex items-center gap-[0.31rem]">
                        <div
                          onClick={() => router.push('/myevent/host')}
                          className="w-full rounded-[0.5rem] bg-[#17181C]/50 px-2 pb-[0.81rem] pt-[0.81rem] text-center text-body-13-bold text-white">
                          주최이벤트 관리하기
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="">
                      <div className="mb-[0.5rem] flex items-center gap-[0.31rem]">
                        <Image src="/icons/Headers/Headers/Symbol.svg" alt="태그" width={17} height={16} />
                        <span className="text-body-14-bold text-white">내 취향 태그</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {preference && preference.length > 0
                            ? // preference에서 랜덤으로 3개 선택
                              preference
                                .sort(() => Math.random() - 0.5) // 랜덤 셔플
                                .slice(0, 3) // 처음 3개만 선택
                                .map((tag: string, index: number) => (
                                  <span
                                    key={index}
                                    className="rounded-[0.5rem] bg-[#131415]/30 px-2 pb-[0.25rem] pt-[0.19rem] text-body-11-medium text-white">
                                    {translateTag(tag)}
                                  </span>
                                ))
                            : null}
                        </div>
                        <button
                          onClick={() => router.push('/onBoarding/custom')}
                          className="flex items-center gap-1 rounded-[0.5rem] bg-white/10 px-2 pb-[0.25rem] pt-[0.19rem] text-body-11-medium text-white">
                          내 취향 수정하기
                          <Image src="/icons/Frame 60.svg" alt="편집" width={10} height={10} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>

            {/* 두 번째 프로필 카드 - 게시판 프로필 */}
            <SwiperSlide>
              <div
                className="mb-[0.62rem] ml-1 mr-5 mt-5 rounded-[0.63rem] p-5"
                style={{
                  background: userProfile?.isPostProfileCreated
                    ? `radial-gradient(127.07% 71.54% at 0% 82.92%, rgba(117, 67, 255, 0.50) 0%, rgba(117, 67, 255, 0.00) 100%), radial-gradient(72.73% 59.06% at 97.01% 32.92%, rgba(80, 67, 255, 0.50) 0%, rgba(80, 67, 255, 0.10) 100%), radial-gradient(44.88% 90.82% at 46.12% -18.01%, rgba(142, 130, 255, 0.30) 0%, rgba(142, 130, 255, 0.00) 100%), #28292A`
                    : `radial-gradient(127.07% 71.54% at 0% 82.92%, #333 0%, rgba(128, 128, 128, 0.00) 100%), radial-gradient(72.73% 59.06% at 97.01% 32.92%, rgba(60, 60, 60, 0.50) 0%, rgba(60, 60, 60, 0.10) 100%), radial-gradient(44.88% 90.82% at 46.12% -18.01%, rgba(211, 211, 211, 0.30) 0%, rgba(211, 211, 211, 0.00) 100%), #28292A`,
                }}>
                <div className="flex h-full flex-col justify-between">
                  {/* 프로필 정보 */}
                  <div className="mb-[1.56rem] flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gray700">
                        <Image
                          src={
                            userProfile?.isPostProfileCreated
                              ? userProfile?.postProfileImageUrl || '/icons/mypage-profile.svg'
                              : '/icons/mypage-profile.svg'
                          }
                          alt="프로필"
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                          style={{ aspectRatio: '1/1' }}
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-button-bold ${userProfile?.isPostProfileCreated ? 'text-white' : 'text-gray100'}`}>
                            {userProfile?.isPostProfileCreated
                              ? userProfile?.postProfileNickname
                              : '프로필을 설정해주세요'}
                          </span>
                        </div>
                        <span className="text-body3-12-medium text-white/70">게시판</span>
                      </div>
                    </div>
                    {userProfile?.isPostProfileCreated && (
                      <button className="rounded-[0.5rem] bg-white/20 px-2 pb-[0.25rem] pt-[0.19rem] text-body-11-medium text-white/80">
                        게시판 프로필
                      </button>
                    )}
                  </div>

                  {/* 게시판 관련 정보 */}
                  <div className="">
                    <div className="flex items-center gap-[0.31rem]">
                      <div
                        onClick={() =>
                          router.push(userProfile?.isPostProfileCreated ? `/board/profile` : `/board/profile/create`)
                        }
                        className="w-full rounded-[0.5rem] bg-[#17181C]/50 px-2 pb-[0.81rem] pt-[0.81rem] text-center text-body-13-bold text-white">
                        {userProfile?.isPostProfileCreated ? '게시판 프로필 바로가기' : '게시판 프로필 만들기'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* My Coupon (왼쪽 가변, 오른쪽 고정) */}
        <div className="mx-5 mb-[0.62rem] rounded-[0.63rem]" onClick={() => router.push('/mypage/coupon')}>
          <div className="relative w-full" style={{ height: COUPON_HEIGHT }}>
            {/* 왼쪽(가변) 레이어: 오른쪽 폭만큼 비워두고 나머지 전부 채움 */}
            <div
              className="absolute inset-y-0 left-0"
              style={{
                right: rightWidth,
              }}
              aria-hidden>
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <image href={leftSprite} width="100%" height="100%" preserveAspectRatio="none" />
              </svg>
            </div>

            {/* 오른쪽(고정) 레이어: 실제 비율대로 폭 고정 */}
            <div className="absolute inset-y-0 right-0" style={{ width: rightWidth }} aria-hidden>
              <div className="relative h-full w-full">
                <Image
                  key={rightSprite} // 소스 바뀌면 재측정 유도
                  src={rightSprite}
                  alt=""
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                    handleRightLoaded({ naturalWidth, naturalHeight })
                  }
                />
              </div>
            </div>

            {/* 내용 오버레이: 오른쪽 폭만큼 패딩 확보 */}
            <div
              className="absolute inset-0 flex items-center justify-between px-4"
              style={{ paddingRight: Math.max(12, rightWidth + 8) }}>
              <div className="flex flex-col">
                <h3 className="text-body-15-bold text-white">My Coupon</h3>
                <p className="text-body-11-medium text-gray200">다운로드한 쿠폰을 확인할 수 있어요!</p>
              </div>
              <div className="flex items-center">{/* 우측 액션 자리 */}</div>
            </div>
          </div>
        </div>

        {/* My Event & My Heart Beat */}
        <div className="mx-5 mb-[0.62rem] flex gap-[0.62rem]">
          <div
            onClick={() => router.push('/myevent')}
            className="flex-1 rounded-[0.63rem] bg-[#28292A] px-4 pb-[0.88rem] pt-3">
            <div className="flex cursor-pointer items-center gap-[0.13rem]">
              <h3 className="text-body-15-bold text-white">My Event</h3>
              <Image src="/icons/local_bar.svg" alt="이동" width={18} height={18} />
            </div>
            <p className="text-body-11-medium text-gray200">참석 예정 이벤트예요!</p>
          </div>
          <div className="flex-1 rounded-[0.63rem] bg-[#28292A] px-4 pb-[0.88rem] pt-3">
            <div onClick={() => router.push('/myheartbeat')} className="flex cursor-pointer items-center gap-[0.13rem]">
              <h3 className="text-body-15-bold text-white">My Heart Beat</h3>
              <Image src="/icons/mode_heat.svg" alt="이동" width={18} height={18} />
            </div>
            <p className="text-body-11-medium text-gray200">내가 저장한 베뉴들이에요!</p>
          </div>
        </div>

        {/* 하단 링크들 */}
        <div className="">
          <div
            onClick={handleInquiryClick}
            className="flex cursor-pointer items-center justify-between px-5 py-4 text-body-15-bold">
            <span className="text-white">문의 사항</span>
            <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={20} height={20} />
          </div>
          <Link href="/terms" className="flex items-center justify-between px-5 py-4 text-body-15-bold">
            <span className="text-white">이용 약관 및 개인 정보 활용</span>
            <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={20} height={20} />
          </Link>
        </div>
      </div>

      {/* 문의사항 모달 */}
      {showInquiryModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setShowInquiryModal(false)}>
            <div
              className="mx-4 w-full max-w-sm rounded-[0.75rem] bg-BG-black px-4 pb-5 pt-7"
              onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center space-y-2">
                <h3 className="mb-[1rem] text-subtitle-20-bold text-white">문의 방법을 선택해주세요</h3>

                {/* 카카오톡 */}
                <div
                  onClick={() => handleContactMethod('kakao')}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-[0.5rem] bg-gray700 p-4 transition-colors hover:bg-gray600">
                  <div className="flex items-center justify-center">
                    <Image src="/icons/kakaoLogo.svg" alt="카카오톡" width={42} height={42} />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-15-bold text-gray100">카카오톡</p>
                    <p className="text-body-13-medium text-gray100">@BeatBuddy</p>
                  </div>
                  <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={16} height={16} />
                </div>

                {/* 인스타그램 */}
                <div
                  onClick={() => handleContactMethod('instagram')}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-[0.5rem] bg-gray700 p-4 transition-colors hover:bg-gray600">
                  <div className="flex items-center justify-center">
                    <Image src="/icons/instaLogo.svg" alt="인스타그램" width={42} height={42} />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-15-bold text-gray100">인스타그램</p>
                    <p className="text-body-13-medium text-gray100">@beatbuddy.kr</p>
                  </div>
                  <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={16} height={16} />
                </div>

                {/* 이메일 */}
                <div
                  onClick={() => handleContactMethod('email')}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-[0.5rem] bg-gray700 p-4 transition-colors hover:bg-gray600">
                  <div className="flex items-center justify-center rounded-full bg-white p-[0.56rem]">
                    <Image src="/icons/icons8-구글-로고.svg" alt="이메일" width={24} height={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-15-bold text-gray100">이메일</p>
                    <p className="text-body-13-medium text-gray100">beatbuddykr@gmail.com</p>
                  </div>
                  <Image src="/icons/Headers/Frame60Gray.svg" alt="이동" width={16} height={16} />
                </div>

                {/* 확인 버튼 */}
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="w-full rounded-[0.5rem] pt-2 text-body1-16-bold text-gray200">
                  확인
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

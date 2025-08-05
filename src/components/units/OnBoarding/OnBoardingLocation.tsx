'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { PostLocation } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState, onboardingLocationState } from '@/context/recoil-context';
import Image from 'next/image';

const locationMap: { [key: string]: string } = {
  홍대: 'HONGDAE',
  이태원: 'ITAEWON',
  압구정: 'APGUJEONG',
  '강남/신사': 'GANGNAM/SINSA',
  기타: 'OTHERS',
};

const locationImages: { [key: string]: string } = {
  홍대: '/images/onBoarding/background/onboarding-4.webp',
  압구정: '/images/onBoarding/background/onboarding-2.webp',
  이태원: '/images/onBoarding/background/onboarding-5.webp',
  '강남/신사': '/images/onBoarding/background/onboarding-7.webp',
  기타: '/images/onBoarding/background/onboarding-9.webp',
};

const locations = Object.keys(locationMap);

export default function OnBoardingLocation() {
  const [selectedLocations, setSelectedLocations] = useRecoilState(onboardingLocationState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const [isAuth, setIsAuth] = useRecoilState(authState);

  // 컴포넌트 마운트 시 저장된 선택 값 확인
  useEffect(() => {
    console.log('OnBoardingLocation - 저장된 선택 지역:', selectedLocations);
  }, []);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prevSelected) => {
      if (prevSelected.includes(location)) {
        setError(null); // Reset error if a valid selection is made
        return prevSelected.filter((l) => l !== location);
      } else if (prevSelected.length < 2) {
        setError(null); // Reset error if a valid selection is made
        return [...prevSelected, location];
      } else {
        setError('최대 2개까지 선택 가능합니다');
        return prevSelected;
      }
    });
  };

  const onClickSubmit = async () => {
    // 선택된 지역이 없으면 함수 실행 중단
    if (selectedLocations.length === 0) {
      setError('최소 1개 이상의 지역을 선택해주세요');
      return;
    }

    const locationData = selectedLocations.map((location) => locationMap[location]).join(',');

    try {
      await PostLocation(access, locationData);
      setIsAuth(true);
      router.push('/onBoarding/myTaste/loading');
    } catch (error) {
      console.error('Error submitting locations:', error);
    }
  };

  // 버튼 활성화 상태 확인
  const isButtonEnabled = selectedLocations.length > 0;

  return (
    <>
      <div className="relative flex w-full flex-col bg-BG-black px-5 pb-20">
        <Image
          src="/icons/landing_step_3.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-36px]"
        />
        <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold text-white">
          관심 지역을
          <br />
          모두 선택해주세요
        </h1>

        <div className="grid w-full grid-cols-2 gap-2">
          {locations.map((location, index) => (
            <div
              key={index}
              onClick={() => toggleLocation(location)}
              className={`relative flex w-full cursor-pointer items-center justify-center rounded-[0.25rem] py-[2.81rem] text-subtitle-20-medium transition-all duration-300 ease-in-out ${
                selectedLocations.includes(location) ? 'text-main' : 'text-white'
              }`}
              style={{
                backgroundImage: `url(${locationImages[location]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              {selectedLocations.includes(location) && (
                <div className="absolute inset-0 rounded-[0.25rem] border-2 border-main bg-black opacity-70 transition-all duration-300 ease-in-out"></div>
              )}
              <span className="relative z-10">{location}</span>
            </div>
          ))}
        </div>
        {error && <div className="mt-4 text-main">{error}</div>}
      </div>
      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <button
          onClick={onClickSubmit}
          disabled={!isButtonEnabled}
          className={`w-full max-w-[560px] rounded-[0.5rem] py-[0.81rem] text-[1rem] font-bold transition-colors ${
            isButtonEnabled ? 'bg-main text-sub2' : 'cursor-not-allowed bg-gray500 text-gray300'
          }`}>
          다음
        </button>
      </div>
    </>
  );
}

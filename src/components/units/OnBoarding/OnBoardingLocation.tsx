'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { PostLocation } from '@/lib/action'; // 경로를 적절히 수정하세요
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState, onboardingLocationState } from '@/context/recoil-context';
import Image from 'next/image';
import { motion } from 'framer-motion';

const locationMap: { [key: string]: string } = {
  홍대: 'HONGDAE',
  이태원: 'ITAEWON',
  압구정로데오: 'APGUJEONG',
  '강남 · 신사': 'GANGNAM/SINSA',
  기타: 'OTHERS',
};

const locationImages: { [key: string]: string } = {
  홍대: '/images/onBoarding/background/onboarding-4.webp',
  압구정로데오: '/images/onBoarding/background/onboarding-2.webp',
  이태원: '/images/onBoarding/background/onboarding-5.webp',
  '강남 · 신사': '/images/onBoarding/background/onboarding-7.webp',
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
        <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold text-white">
          관심 지역을
          <br />
          모두 선택해주세요
        </h1>

        <div className="grid w-full grid-cols-2 gap-2">
          {locations.map((location, index) => (
            <motion.div
              key={index}
              onClick={() => toggleLocation(location)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex w-full cursor-pointer items-center justify-center rounded-[0.25rem] py-[2.81rem] text-body1-16-medium ${
                selectedLocations.includes(location) ? 'text-main' : 'text-white'
              }`}
              style={{
                backgroundImage: `url(${locationImages[location]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              {selectedLocations.includes(location) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 rounded-[0.25rem] border-2 border-main bg-black opacity-70"
                />
              )}
              <span className="relative z-10">{location}</span>
            </motion.div>
          ))}
        </div>
        {error && <div className="mt-[0.63rem] text-body3-12-medium text-main">{error}</div>}
      </div>
      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <motion.button
          onClick={onClickSubmit}
          disabled={!isButtonEnabled}
          whileHover={isButtonEnabled ? { scale: 1.02 } : {}}
          whileTap={isButtonEnabled ? { scale: 0.98 } : {}}
          className={`w-full max-w-[560px] rounded-[0.5rem] py-[0.81rem] text-button-16-semibold transition-colors ${
            isButtonEnabled ? 'bg-main text-sub2 hover:bg-main/90' : 'cursor-not-allowed bg-gray500 text-gray300'
          }`}>
          다음
        </motion.button>
      </div>
    </>
  );
}

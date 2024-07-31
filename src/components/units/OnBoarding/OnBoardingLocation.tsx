'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PostLocation } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState } from '@/context/recoil-context';
import Image from 'next/image';

const locationMap: { [key: string]: string } = {
  홍대: 'HONGDAE',
  이태원: 'ITAEWON',
  압구정: 'APGUJEONG',
  '강남/신사': 'GANGNAM/SINSA',
  기타: 'OTHERS',
};

const locationImages: { [key: string]: string } = {
  홍대: '/images/onboarding/background/onboarding-4.png',
  압구정: '/images/onboarding/background/onboarding-2.png',
  이태원: '/images/onboarding/background/onboarding-5.png',
  '강남/신사': '/images/onboarding/background/onboarding-7.png',
  기타: '/images/onboarding/background/onboarding-9.png',
};

const locations = Object.keys(locationMap);

export default function OnBoardingLocation() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const [isAuth, setIsAuth] = useRecoilState(authState);

  const toggleLocation = (location: string) => {
    setSelectedLocations((prevSelected) => {
      if (prevSelected.includes(location)) {
        setError(null); // Reset error if a valid selection is made
        return prevSelected.filter((l) => l !== location);
      } else if (prevSelected.length < 2) {
        setError(null); // Reset error if a valid selection is made
        return [...prevSelected, location];
      } else {
        setError('최대 2개 선택 가능합니다.');
        return prevSelected;
      }
    });
  };

  const onClickSubmit = async () => {
    const locationData = selectedLocations.map((location) => locationMap[location]).join(',');

    try {
      await PostLocation(access, locationData);
      setIsAuth(true);
      router.push('/onBoarding/myTaste/complete');
    } catch (error) {
      console.error('Error submitting locations:', error);
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col px-4">
        <Image
          src="/icons/landing_step_3.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-32px]"
        />
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          관심 지역을
          <br />
          모두 선택해주세요
        </h1>

        <div className="mt-7 flex flex-wrap gap-2">
          {locations.map((location, index) => (
            <div
              key={index}
              onClick={() => toggleLocation(location)}
              className={`relative flex h-[7.5rem] w-[48.8%] cursor-pointer items-center justify-center rounded-[0.25rem] text-xl hover:brightness-75 ${
                selectedLocations.includes(location) ? 'text-main' : 'text-white'
              }`}
              style={{
                backgroundImage: `url(${locationImages[location]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              {selectedLocations.includes(location) && (
                <div className="absolute inset-0 rounded-[0.25rem] border-2 border-main bg-black opacity-70"></div>
              )}
              <span className="relative z-10">{location}</span>
            </div>
          ))}
        </div>
        {error && <div className="mt-4 text-main">{error}</div>}
      </div>
      <button
        onClick={onClickSubmit}
        disabled={selectedLocations.length === 0}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          selectedLocations.length > 0 ? 'bg-main text-BG-black hover:brightness-105' : 'bg-gray400 text-gray300'
        }`}>
        다음
      </button>
    </>
  );
}

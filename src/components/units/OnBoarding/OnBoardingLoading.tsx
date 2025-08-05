'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostLocation } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState } from '@/context/recoil-context';
import Image from 'next/image';
import { GetNickname } from '@/lib/action';

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

export default function OnBoardingLoading() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [nickname, setNickname] = useState<string>('');
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

  useEffect(() => {
    const getNickname = async () => {
      const response = await GetNickname(access);
      if (response.ok) {
        const data = await response.json();
        setNickname(data.nickname);
      }
    };
    getNickname();
  }, []);

  // 3초 후 complete 페이지로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onBoarding/complete');
    }, 3000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, [router]);

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
    <div className="relative flex w-full flex-col bg-BG-black px-5 pb-20">
      <Image
        src="/icons/landing_step_3.svg"
        alt="prev"
        width={55}
        height={24}
        className="absolute right-5 top-[-36px]"
      />
      <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold text-white">
        {nickname}버디님을 위한
        <br />
        맞춤 베뉴를 찾고 있어요
      </h1>

      <div className="flex flex-1 items-center justify-center py-20">
        <Image src="/icons/lightLogo.svg" alt="로딩 애니메이션" width={48} height={44} />
      </div>

      {error && <div className="mt-4 text-main">{error}</div>}
    </div>
  );
}

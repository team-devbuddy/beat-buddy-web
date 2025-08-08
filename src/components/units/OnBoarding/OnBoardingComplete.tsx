'use client';
import { useRouter } from 'next/navigation';
import {
  accessTokenState,
  memberGenreIdState,
  memberMoodIdState,
  onboardingGenreState,
  onboardingMoodState,
  onboardingLocationState,
} from '@/context/recoil-context';
import { GetNickname, PostArchive } from '@/lib/action';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';

export default function OnBoardingComplete() {
  const memberMoodId = useRecoilValue(memberMoodIdState);
  const memberGenreId = useRecoilValue(memberGenreIdState);
  const access = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');

  // 온보딩 상태 초기화를 위한 setters
  const setOnboardingGenre = useSetRecoilState(onboardingGenreState);
  const setOnboardingMood = useSetRecoilState(onboardingMoodState);
  const setOnboardingLocation = useSetRecoilState(onboardingLocationState);

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

  const onClickSubmit = async () => {
    console.log('memberGenreId:', memberGenreId);
    if (memberGenreId !== null && memberMoodId !== null) {
      try {
        const response = await PostArchive(access, { memberGenreId, memberMoodId });
        if (response.ok) {
          // 온보딩 완료 후 선택 값들 초기화
          setOnboardingGenre([]);
          setOnboardingMood([]);
          setOnboardingLocation([]);

          router.push('/bbp-onboarding');
        } else {
          alert('Error creating archive');
        }
      } catch (error) {
        console.error('Error submitting archive:', error);
      }
    } else {
      console.error('Error: memberGenreId or memberMoodId is null');
    }
  };

  return (
    <div className="relative flex w-full flex-col bg-BG-black px-5">
      <div className="flex w-full flex-col">
        <Image
          src="/icons/landing_step_3.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-36px] z-10"
        />
        <div className="flex w-full flex-col">
          <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold text-white">
            {nickname}버디님을 위한
            <br />
            맞춤 베뉴를 찾았어요!
          </h1>
        </div>

        <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
          <button
            onClick={onClickSubmit}
            className={`w-full max-w-[560px] rounded-[0.5rem] bg-main py-[0.81rem] text-[1rem] font-bold text-sub2`}>
            확인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

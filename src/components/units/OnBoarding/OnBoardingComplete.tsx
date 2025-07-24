'use client';
import { useRouter } from 'next/navigation';
import { accessTokenState, memberGenreIdState, memberMoodIdState } from '@/context/recoil-context';
import { GetNickname, PostArchive } from '@/lib/action';
import { useRecoilValue } from 'recoil';
import { use, useEffect, useState } from 'react';
import Image from 'next/image';

export default function OnBoardingComplete() {
  const memberMoodId = useRecoilValue(memberMoodIdState);
  const memberGenreId = useRecoilValue(memberGenreIdState);
  const access = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [nickname, setNickname] = useState<string>('');

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
          router.push('/');
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
    <div className="relative flex w-full flex-col bg-BG-black px-5 ">
      <div className="flex w-full flex-col">
        <Image
          src="/icons/landing_step_3.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-36px] z-10"
        />
        <div className="flex w-full flex-col ">
          <h1 className="pb-[1.25rem] pt-[0.62rem] text-title-24-bold text-white">
            {nickname}버디님을 위한
            <br />
            맞춤 베뉴를 찾았어요!
          </h1>
        </div>

        <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
          <button
            onClick={onClickSubmit}
            className={`w-full max-w-md rounded-[0.5rem] bg-main py-4 text-[1rem] font-bold text-sub2 hover:brightness-105`}>
            확인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}

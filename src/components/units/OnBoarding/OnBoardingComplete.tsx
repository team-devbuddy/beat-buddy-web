'use client';
import { useRouter } from 'next/navigation';
import { accessTokenState, memberGenreIdState, memberMoodIdState } from '@/context/recoil-context';
import { GetNickname, PostArchive } from '@/lib/action';
import { useRecoilValue } from 'recoil';
import { use, useEffect, useState } from 'react';

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
    <div>
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col px-4 pt-[3.5rem]">
          <h1 className="py-5 text-2xl font-bold leading-9 text-white">
            {nickname} 버디님을 위한
            <br />
            맞춤 베뉴를 찾았어요!
          </h1>
        </div>

        <button
          onClick={onClickSubmit}
          className={`absolute bottom-0 flex w-full justify-center bg-main py-4 text-lg font-bold text-BG-black hover:brightness-105`}>
          확인하러 가기
        </button>
      </div>
    </div>
  );
}

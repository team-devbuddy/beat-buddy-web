'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PostMood } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

const moodMap: { [key: string]: string } = {
  신나는: 'EXCITING',
  힙한: 'HIP',
  펑키한: 'FUNKY',
  칠한: 'CHILLY',
  이국적인: 'EXOTIC',
  트렌디한: 'TRENDY',
  트로피컬한: 'TROPICAL',
  다크한: 'DARK',
};

const moodImages: { [key: string]: string } = {
  신나는: '/images/onBoarding/background/onboarding-3.png',
  힙한: '/images/onBoarding/background/onboarding-7.png',
  펑키한: '/images/onBoarding/background/onboarding-1.png',
  칠한: '/images/onBoarding/background/onboarding-5.png',
  이국적인: '/images/onBoarding/background/onboarding-2.png',
  트렌디한: '/images/onBoarding/background/onboarding-6.png',
  트로피컬한: '/images/onBoarding/background/onboarding-4.png',
  다크한: '/images/onBoarding/background/onboarding-8.png',
};

const moods = Object.keys(moodMap);

export default function OnBoardingMood() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';

  const toggleMood = (mood: string) => {
    setSelectedMoods((prevSelected) =>
      prevSelected.includes(mood) ? prevSelected.filter((m) => m !== mood) : [...prevSelected, mood],
    );
  };

  const onClickSubmit = async () => {
    const moodData = moods.reduce<{ [key: string]: number }>((acc, mood) => {
      acc[moodMap[mood]] = selectedMoods.includes(mood) ? 1.0 : 0.0;
      return acc;
    }, {});

    try {
      await PostMood(access, { moodPreferences: moodData });
      router.push('/onBoarding/myTaste/location');
    } catch (error) {
      console.error('Error submitting moods:', error);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          어떤 분위기를
          <br />
          좋아하세요?
        </h1>

        <div className="mt-7 flex flex-wrap gap-2">
          {moods.map((mood, index) => (
            <div
              key={index}
              onClick={() => toggleMood(mood)}
              className={`relative flex h-[3.75rem] w-[48.8%] cursor-pointer items-center justify-center rounded-[0.25rem] text-xl ${
                selectedMoods.includes(mood) ? 'text-main' : 'text-white'
              }`}
              style={{
                backgroundImage: `url(${moodImages[mood]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              {selectedMoods.includes(mood) && (
                <div className="absolute inset-0 rounded-[0.25rem] border-2 border-main bg-black opacity-70"></div>
              )}
              <span className="relative z-10">{mood}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onClickSubmit}
        disabled={selectedMoods.length === 0}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          selectedMoods.length > 0 ? 'bg-main text-BG-black' : 'bg-gray400 text-gray300'
        }`}>
        다음
      </button>
    </>
  );
}

'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PostMood } from '@/lib/action';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, memberMoodIdState } from '@/context/recoil-context';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import InfoModal from './MoodInfoModal';

const moodMap: { [key: string]: string } = {
  클럽: 'CLUB',
  펍: 'PUB',
  루프탑: 'ROOFTOP',
  딥한: 'DEEP',
  커머셜한: 'COMMERCIAL',
  칠한: 'CHILL',
  이국적인: 'EXOTIC',
  헌팅: 'HUNTING',
};

const moodImages: { [key: string]: string } = {
  펍: '/images/onBoarding/background/onboarding-3.webp',
  클럽: '/images/onBoarding/background/onboarding-7.webp',
  딥한: '/images/onBoarding/background/onboarding-1.webp',
  칠한: '/images/onBoarding/background/onboarding-5.webp',
  커머셜한: '/images/onBoarding/background/onboarding-2.webp',
  헌팅: '/images/onBoarding/background/onboarding-6.webp',
  이국적인: '/images/onBoarding/background/onboarding-4.webp',
  루프탑: '/images/onBoarding/background/onboarding-8.webp',
};

const moods = Object.keys(moodMap);

export default function OnBoardingMood() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const [memberMoodId, setMemberMoodId] = useRecoilState(memberMoodIdState);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prevSelected) => {
      if (prevSelected.includes(mood)) {
        return prevSelected.filter((m) => m !== mood);
      } else if (prevSelected.length < 4) {
        return [...prevSelected, mood];
      } else {
        setError('최대 4개까지 선택 가능합니다');
        return prevSelected;
      }
    });
  };

  const onClickSubmit = async () => {
    const moodData = moods.reduce<{ [key: string]: number }>((acc, mood) => {
      acc[moodMap[mood]] = selectedMoods.includes(mood) ? 1.0 : 0.0;
      return acc;
    }, {});

    try {
      const response = await PostMood(access, { moodPreferences: moodData });
      if (response.ok) {
        const result = await response.json();
        setMemberMoodId(result.vectorId);
        router.push('/onBoarding/myTaste/location');
      }
    } catch (error) {
      console.error('Error submitting moods:', error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="relative flex w-full flex-col px-4">
        <Image
          src="/icons/landing_step_2.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-32px]"
        />
        <div className="flex items-start justify-between py-5">
          <h1 className="text-2xl font-bold leading-9 text-white">
            어떤 분위기를
            <br />
            좋아하세요?
          </h1>
          <div className="relative">
            <Image
              src="/icons/infomationIcon.svg"
              alt="info"
              width={24}
              height={24}
              onClick={toggleModal}
              className="cursor-pointer hover:brightness-75"
            />
            <AnimatePresence>{isModalOpen && <InfoModal onClose={toggleModal} />}</AnimatePresence>
          </div>
        </div>

        <div className="mt-7 grid w-full grid-cols-2 gap-2">
          {moods.map((mood, index) => (
            <div
              key={index}
              onClick={() => toggleMood(mood)}
              className={`relative flex h-[3.75rem] w-full cursor-pointer items-center justify-center rounded-[0.25rem] text-xl hover:brightness-75 ${
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
        {error && <div className="mt-4 text-main">{error}</div>}
      </div>
      <button
        onClick={onClickSubmit}
        disabled={selectedMoods.length === 0}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          selectedMoods.length > 0 ? 'bg-main text-BG-black hover:brightness-105' : 'bg-gray400 text-gray300'
        }`}>
        다음
      </button>
    </>
  );
}

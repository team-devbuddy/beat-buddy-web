'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';
import { PostMood, PostArchive } from '@/lib/action';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, memberGenreIdState, memberMoodIdState } from '@/context/recoil-context';
import Image from 'next/image';

import { AnimatePresence } from 'framer-motion';
import InfoModal from './MoodInfoModal';

const moodMap: { [key: string]: string } = {
  펍: 'PUB',
  클럽: 'CLUB',
  딥한: 'DEEP',
  칠한: 'CHILL',
  커머셜한: 'COMMERCIAL',
  헌팅: 'HUNTING',
  이국적인: 'EXOTIC',
  루프탑: 'ROOFTOP',
};

const moodImages: { [key: string]: string } = {
  펍: '/images/onBoarding/background/onboarding-3.png',
  클럽: '/images/onBoarding/background/onboarding-7.png',
  딥한: '/images/onBoarding/background/onboarding-1.png',
  칠한: '/images/onBoarding/background/onboarding-5.png',
  커머셜한: '/images/onBoarding/background/onboarding-2.png',
  헌팅: '/images/onBoarding/background/onboarding-6.png',
  이국적인: '/images/onBoarding/background/onboarding-4.png',
  루프탑: '/images/onBoarding/background/onboarding-8.png',
};

const moods = Object.keys(moodMap);

export default function OnBoardingMood() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const memberGenreId = useRecoilValue(memberGenreIdState);
  const [memberMoodId, setMemberMoodId] = useRecoilState(memberMoodIdState);

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
      const response = await PostMood(access, { moodPreferences: moodData });
      if (response.ok) {
        const result = await response.json();
        setMemberMoodId(result.vectorId);
      }

      if (memberGenreId !== null && memberMoodId !== null) {
        const response = await PostArchive(access, { memberGenreId, memberMoodId: memberMoodId });
        if (response.ok) {
          router.push('/onBoarding/myTaste/location');
        }
      } else {
        console.error('Error: memberGenreId or memberMoodId is null');
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
      <div className="flex w-full flex-col px-4">
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
              className="cursor-pointer"
            />
            <AnimatePresence>{isModalOpen && <InfoModal onClose={toggleModal} />}</AnimatePresence>
          </div>
        </div>

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

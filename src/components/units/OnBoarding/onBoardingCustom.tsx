'use client';
import { accessTokenState } from '@/context/recoil-context';
import { GetNickname } from '@/lib/action';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import PinkMainLogo from '@/components/icons/PinkMainLogo';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function OnBoardingCustom() {
  const access = useRecoilValue(accessTokenState) || '';
  const [nickname, setNickname] = useState<string>('');
  const router = useRouter();
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

  return (
    <>
      <div className="flex w-full flex-col px-5">
        <div className="flex pb-5 pt-10">
          <PinkMainLogo width={43} height={40} className="safari-icon-fix" />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-start text-title-24-bold text-white">
            지금 바로 {nickname}버디님의
            <br />
            취향 저격 베뉴들을 둘러보세요
          </p>
        </div>
      </div>
      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <motion.button
          onClick={() => router.push('/onBoarding/myTaste/genre')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-[560px] rounded-[0.5rem] bg-main py-[0.81rem] text-button-16-semibold text-sub2 transition-colors hover:bg-main/90">
          베뉴 추천받기
        </motion.button>
      </div>
    </>
  );
}

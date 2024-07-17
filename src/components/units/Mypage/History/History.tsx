'use client';
import { accessTokenState } from '@/context/recoil-context';
import { GetHistory } from '@/lib/action';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

export default function History() {
  const access = useRecoilValue(accessTokenState) || '';

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await GetHistory(access);
      console.log(response);
    };
    fetchHistory();
  }, []);
  return (
    <>
      {/* MyHistoy Card */}
      <div className="ml-4 flex overflow-x-auto hide-scrollbar">
        <div
          className="flex h-[15.6rem] w-[20rem] flex-shrink-0 flex-col justify-between rounded-[0.38rem] bg-[#242730] px-4 py-6"
          style={{ backgroundImage: `url('/images/onBoarding/background/onboarding-1.png')` }}>
          <p className="font-queensides text-[2.5rem] font-light text-white">07.17</p>
          <div className="flex gap-2">
            <div className="rounded-[0.13rem] bg-gray500 px-[0.38rem] py-[0.12rem] text-gray100">홍대</div>
          </div>
        </div>
        <div
          style={{ backgroundImage: `url('/images/onBoarding/background/onboarding-2.png')` }}
          className="ml-4 flex h-[15.6rem] w-[20rem] flex-shrink-0 flex-col justify-between rounded-[0.38rem] bg-[#242730] px-4 py-6">
          <p className="font-queensides text-[2.5rem] font-light text-white">06.19</p>
          <div className="flex gap-2">
            <div className="rounded-[0.13rem] bg-gray500 px-[0.38rem] py-[0.12rem] text-gray100">홍대</div>
          </div>
        </div>
      </div>
    </>
  );
}

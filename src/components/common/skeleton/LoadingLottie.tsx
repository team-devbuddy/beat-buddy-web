'use client';
import Lottie from 'react-lottie-player';
import loadingLottie from '../../../../public/loadingLottie.json';
import { useEffect, useState } from 'react';

const Loading = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <Lottie loop animationData={loadingLottie} play style={{ width: '204px', height: '87px' }} />
          <div className="mt-[2.1rem] text-[0.93rem] text-main">Feel the beat, Live the night</div>
        </div>
      )}
    </>
  );
};

export default Loading;

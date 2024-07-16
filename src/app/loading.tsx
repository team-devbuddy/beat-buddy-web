'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Lottie from 'react-lottie-player';

const Loading = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className="flex h-screen w-full items-center justify-center">
          <Lottie loop animationData={require('../../public/loadingLottie.json')} play style={{ width: '140px', height: '60px' }} />
        </div>
      )}
    </>
  );
};

export default Loading;

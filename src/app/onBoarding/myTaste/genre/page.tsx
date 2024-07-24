import Prev from '@/components/common/Prev';
import OnBoardingGenre from '@/components/units/OnBoarding/OnBoardingGenre';
import React from 'react';

export default function OnBordingGenre() {
  return (
    <div className="flex w-full flex-col">
      <Prev url="/onboarding/custom" />
      <OnBoardingGenre />
    </div>
  );
}

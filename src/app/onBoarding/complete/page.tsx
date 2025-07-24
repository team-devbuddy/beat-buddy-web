import Prev from '@/components/common/Prev';
import OnBoardingComplete from '@/components/units/OnBoarding/OnBoardingComplete';

export default function OnBordingComplete() {
  return (
    <div className="flex w-full flex-col">
      <Prev url={'/onBoarding/myTaste/location'} />
      <OnBoardingComplete />
    </div>
  );
}
import Prev from '@/components/common/Prev';
import OnBoardingLocation from '@/components/units/OnBoarding/OnBoardingLocation';

export default function OnBordingLocation() {
  return (
    <div className="flex w-full flex-col">
      <Prev url={'/onBoarding/myTaste/mood'} />
      <OnBoardingLocation />
    </div>
  );
}

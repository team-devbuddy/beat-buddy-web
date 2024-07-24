import Prev from '@/components/common/Prev';
import OnBoardingMood from '@/components/units/OnBoarding/OnBoardingMood';

export default function OnBordingMood() {
  return (
    <div className="flex w-full flex-col">
      <Prev url="/onBoarding/myTaste/genre" />
      <OnBoardingMood />
    </div>
  );
}

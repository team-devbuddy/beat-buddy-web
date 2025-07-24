import Prev from '@/components/common/Prev';
import OnBoardingLoading from '@/components/units/OnBoarding/OnBoardingLoading';

export default function OnBordingLoading() {
  return (
    <div className="flex w-full flex-col">
      <Prev url={'/onBoarding/myTaste/location'} />
      <OnBoardingLoading />
    </div>
  );
}
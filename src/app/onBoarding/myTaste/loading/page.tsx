import Prev from '@/components/common/Prev';
import OnBoardingLoading from '@/components/units/OnBoarding/OnBoardingLoading';

export default function OnBordingLoading() {
  return (
    <div className="flex h-screen w-full flex-col bg-BG-black">
      <Prev url={'/onBoarding/myTaste/location'} />
      <OnBoardingLoading />
    </div>
  );
}
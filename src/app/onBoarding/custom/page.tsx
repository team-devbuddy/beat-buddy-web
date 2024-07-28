import Prev from '@/components/common/Prev';
import OnBoardingLottie from '@/components/units/OnBoarding/OnBoardingLottie';

export default function onBoardingCustomPage() {
  return (
    <>
      <Prev url={'/onBoarding/name'} />
      <OnBoardingLottie />
      {/* <OnBoardingCustom /> */}
    </>
  );
}

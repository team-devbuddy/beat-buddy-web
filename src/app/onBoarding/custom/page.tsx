import Prev from '@/components/common/Prev';
import OnBoardingCustom from '@/components/units/OnBoarding/onBoardingCustom';

export default function onBoardingCustomPage() {
  return (
    <div className="flex flex-col">
      <Prev url={'/onBoarding/name'} />
      <OnBoardingCustom />
    </div>
  );
}

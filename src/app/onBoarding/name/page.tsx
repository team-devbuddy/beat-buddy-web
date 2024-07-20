import Prev from '@/components/common/Prev';
import OnboardingName from '@/components/units/OnBoarding/OnboardingName';

export default function OnBoardingNamePage() {
  return (
    <div className="w-full">
      <Prev url={'/onBoarding'} />
      <OnboardingName />
    </div>
  );
}

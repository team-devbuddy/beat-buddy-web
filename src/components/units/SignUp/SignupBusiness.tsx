'use client';

import { useState } from 'react';
import SignUpStep1 from './SignupBusiness1';
import SignUpStep2 from './SignupBusiness2';

export default function SignUpBusiness() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-BG-black text-white">
      {step === 1 && <SignUpStep1 onNext={nextStep} />}
      {step === 2 && <SignUpStep2 onNext={nextStep} onBack={prevStep} />}
    </div>
  );
}

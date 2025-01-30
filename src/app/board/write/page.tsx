'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BoardWriteHeader from '@/components/units/Detail/Board/Write/BoardWriteHeader';
import BoardForm from '@/components/units/Detail/Board/Write/BoardForm';
import BoardSubmitButton from '@/components/units/Detail/Board/Write/BoardSubmitButton';

const BoardWritePage = () => {
  const searchParams = useSearchParams();
  const venueEngName = searchParams.get('venueEngName') || '';
  const venueId = searchParams.get('venueId') || '';
  const venueLocation = searchParams.get('venueLocation') || '';

  const [formData, setFormData] = useState({
    title: '',
    date: { year: '', month: '', day: '' },
    minParticipants: '',
    maxParticipants: '',
    cost: '',
    content: '',
    location: venueLocation,
    venue: venueEngName,
  });

  const [type, setType] = useState('free');
  const [step, setStep] = useState(1);

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (selectedType: string) => {
    setType(selectedType);
  };

  const handleSubmit = () => {
    // 제출 로직 구현
    setStep(2);
  };

  return (
    <div className="relative min-h-screen bg-BG-black text-white">
      <BoardWriteHeader title={venueEngName} currentStep={step} totalSteps={2} />
      <BoardForm
        formData={formData}
        onFormChange={handleFormChange}
        onTypeChange={handleTypeChange}
      />
      <BoardSubmitButton
        onClick={handleSubmit}
        isDisabled={!formData.title || !formData.content}
      />
    </div>
  );
};

export default BoardWritePage;

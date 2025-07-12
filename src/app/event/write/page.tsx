// app/event/write/page.tsx
'use client';

import EventWriteHeader from '@/components/units/Event/Write/EventWriteHeader';
import ImageUploader from '@/components/units/Event/Write/EventImageUploader';
import EventPlaceInput from '@/components/units/Event/Write/EventPlaceInput';
import EventTitleInput from '@/components/units/Event/Write/EventTitleInput';
import EventNoticeInput from '@/components/units/Event/Write/EventNoticeInput';
import EventIntroInput from '@/components/units/Event/Write/EventIntroInput';
import EventDateInput from '@/components/units/Event/Write/EventDateInput';
import EventEntranceFee from '@/components/units/Event/Write/EventEntranceFee';
import { useState } from 'react';
import EventRegisterStepForm from '@/components/units/Event/Write/EventRegisterStepForm';

export default function EventWritePage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  return (
    <div className="pb-10">
      <EventWriteHeader />

      <h1 className="px-5 py-2 text-[1.25rem] font-bold text-white">다가오는 특별한 이벤트 소식을 전해주세요!</h1>

      <ImageUploader onUpload={setUploadedImages} uploadedImages={uploadedImages} />

      <EventTitleInput />

      <EventDateInput />

      <EventPlaceInput />

      <EventEntranceFee />
      <EventNoticeInput />

          <EventIntroInput />
          <EventRegisterStepForm />
      
    </div>
  );
}

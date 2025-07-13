'use client';

import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { eventFormState, accessTokenState } from '@/context/recoil-context';

import EventWriteHeader from '@/components/units/Event/Write/EventWriteHeader';
import ImageUploader from '@/components/units/Event/Write/EventImageUploader';
import EventPlaceInput from '@/components/units/Event/Write/EventPlaceInput';
import EventTitleInput from '@/components/units/Event/Write/EventTitleInput';
import EventNoticeInput from '@/components/units/Event/Write/EventNoticeInput';
import EventIntroInput from '@/components/units/Event/Write/EventIntroInput';
import EventDateInput from '@/components/units/Event/Write/EventDateInput';
import EventEntranceFee from '@/components/units/Event/Write/EventEntranceFee';
import EventRegisterStepForm from '@/components/units/Event/Write/EventRegisterStepForm';

export default function EventWritePage() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const eventForm = useRecoilValue(eventFormState);
  const accessToken = useRecoilValue(accessTokenState);

  const {
    title,
    startDate,
    endDate,
    location,
    region,
    isFreeEntrance,
    entranceFee,
    entranceNotice,
    notice,
    content,
    isAuthor,
    isAttending,
    receiveInfo,
    receiveName,
    receiveGender,
    receivePhoneNumber,
    receiveTotalCount,
    receiveSNSId,
    receiveMoney,
    depositAccount,
    depositAmount,
    startTime,
    endTime,
    venueId,
  } = eventForm;

  const isFormValid =
    title.trim() !== '' &&
    startDate.trim() !== '' &&
    endDate.trim() !== '' &&
    location?.trim() !== '' &&
    region.trim() !== '' &&
    (isFreeEntrance || entranceFee.trim() !== '');

  const normalizeDate = (dateStr: string) => dateStr.replace(/\./g, '-').replace(/\s/g, '').trim();

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    uploadedImages.forEach((file) => {
      formData.append('images', file);
    });

    const eventCreateRequestDTO = {
      venueId,
      title,
      content,
      likes: 0,
      views: 0,
      liked: false,
      startDate: new Date(`${normalizedStartDate}T${startTime || '00:00'}:00`).toISOString(),
      endDate: new Date(`${normalizedEndDate}T${endTime || '00:00'}:00`).toISOString(),
      receiveInfo,
      receiveName,
      receiveGender,
      receivePhoneNumber,
      receiveTotalCount,
      receiveSNSId,
      receiveMoney,
      depositAccount,
      depositAmount: receiveMoney ? Number(depositAmount) : 0,
      isAuthor,
      entranceFee: isFreeEntrance ? 0 : Number(entranceFee.replace(/,/g, '')),
      entranceNotice: entranceNotice || '',
      notice: notice || '',
      isFreeEntrance,
      region,
      location,
      isAttending,
    };

    formData.append(
      'eventCreateRequestDTO',
      new Blob([JSON.stringify(eventCreateRequestDTO)], { type: 'application/json' }),
    );

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events`, {
        method: 'POST',
        headers: {
          Access: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`이벤트 생성 실패: ${res.status} - ${errorText}`);
      }

      const result = await res.json();
      alert('이벤트가 성공적으로 생성되었습니다!');
      window.location.href = '/event';
    } catch (error) {
      console.error('이벤트 생성 에러:', error);
      alert(`이벤트 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

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

      <div className="flex px-5">
        <button
          disabled={!isFormValid}
          onClick={handleSubmit}
          className={`w-full rounded-[0.38rem] py-4 text-[0.875rem] font-bold ${
            isFormValid ? 'bg-main hover:bg-main text-sub2' : 'bg-gray500 text-gray300'
          }`}>
          이벤트 등록하기
        </button>
      </div>
    </div>
  );
}

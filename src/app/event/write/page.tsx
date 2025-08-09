'use client';

import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { eventFormState, accessTokenState, isEventEditModeState, eventState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const accessToken = useRecoilValue(accessTokenState);
  const isEditMode = useRecoilValue(isEventEditModeState);
  const setIsEditMode = useSetRecoilState(isEventEditModeState);
  const event = useRecoilValue(eventState);
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const router = useRouter();

  // 디버깅 정보 추가
  console.log('EventWritePage Debug:', {
    eventId,
    isEditMode,
    event: event ? { eventId: event.eventId, title: event.title } : null,
    searchParams: searchParams.toString(),
  });

  // URL에 eventId가 있으면 수정 모드로 설정
  useEffect(() => {
    if (eventId) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, [eventId, setIsEditMode]);

  // 수정 모드일 때만 이벤트 데이터 로드
  useEffect(() => {
    if (isEditMode && event && eventId) {
      // 이벤트 폼을 현재 이벤트 데이터로 채움
      setEventForm({
        venueId: 0, // EventDetail에 venueId가 없으므로 0으로 설정
        title: event.title || '',
        content: event.content || '',
        startDate: event.startDate
          ? new Date(event.startDate)
              .toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\. /g, '. ')
              .replace(/\.$/, '')
          : '',
        endDate: event.endDate
          ? new Date(event.endDate)
              .toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
              .replace(/\. /g, '. ')
              .replace(/\.$/, '')
          : '',
        startTime: event.startDate
          ? new Date(event.startDate).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : '',
        endTime: event.endDate
          ? new Date(event.endDate).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : '',
        location: event.location || '',
        region: event.region || '',
        isFreeEntrance: event.entranceFee === 0 || event.isFreeEntrance,
        entranceFee: event.entranceFee === 0 ? '0' : event.entranceFee > 0 ? event.entranceFee.toString() : '',
        entranceNotice: event.entranceNotice || '',
        notice: event.notice || '',
        receiveInfo: event.receiveInfo || false,
        receiveName: event.receiveName || false,
        receiveGender: event.receiveGender || false,
        receivePhoneNumber: event.receivePhoneNumber || false,
        receiveTotalCount: false, // EventDetail에 없으므로 false
        receiveSNSId: event.receiveSNSId || false,
        receiveMoney: event.receiveMoney || false,
        depositAccount: event.depositAccount || '',
        depositAmount: event.depositAmount > 0 ? event.depositAmount.toString() : '',
        isAuthor: event.isAuthor || false,
        isAttending: event.isAttending || false,
      });
    } else {
      // 수정 모드가 아닌 경우 항상 폼 초기화 (초기 작성 모드)
      setEventForm({
        venueId: 0,
        title: '',
        content: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        location: '',
        region: '',
        isFreeEntrance: false,
        entranceFee: '',
        entranceNotice: '',
        notice: '',
        receiveInfo: false,
        receiveName: false,
        receiveGender: false,
        receivePhoneNumber: false,
        receiveTotalCount: false,
        receiveSNSId: false,
        receiveMoney: false,
        depositAccount: '',
        depositAmount: '',
        isAuthor: true,
        isAttending: false,
      });
    }
  }, [isEditMode, event, eventId, setEventForm]);

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
    (isFreeEntrance || entranceFee.trim() !== '') &&
    // 사전 예약금 정보를 받겠다고 선택했을 때는 계좌와 금액이 모두 입력되어야 함
    (!receiveMoney || (depositAccount.trim() !== '' && depositAmount.trim() !== ''));

  const normalizeDate = (dateStr: string) => dateStr.replace(/\./g, '-').replace(/\s/g, '').trim();

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    // 이미지 추가 (새로 업로드된 이미지만)
    uploadedImages.forEach((file) => {
      formData.append('images', file);
    });

    if (isEditMode && event?.eventId) {
      // 수정 모드: 변경된 필드만 전송
      const updateData: any = {};

      // 기본 필드들
      if (title !== event.title) updateData.title = title;
      if (content !== event.content) updateData.content = content;
      if (location !== event.location) updateData.location = location;
      if (region !== event.region) updateData.region = region;
      if (notice !== event.notice) updateData.notice = notice;
      if (entranceNotice !== event.entranceNotice) updateData.entranceNotice = entranceNotice;

      // 날짜와 시간 관련
      const currentStartDate = event.startDate ? new Date(event.startDate).toISOString() : '';
      const currentEndDate = event.endDate ? new Date(event.endDate).toISOString() : '';
      const newStartDate = new Date(`${normalizedStartDate}T${startTime || '00:00'}:00`).toISOString();
      const newEndDate = new Date(`${normalizedEndDate}T${endTime || '00:00'}:00`).toISOString();

      if (newStartDate !== currentStartDate) updateData.startDate = newStartDate;
      if (newEndDate !== currentEndDate) updateData.endDate = newEndDate;

      // 입장료 관련
      const currentIsFreeEntrance = event.entranceFee === 0 || event.isFreeEntrance;
      if (isFreeEntrance !== currentIsFreeEntrance) {
        updateData.isFreeEntrance = isFreeEntrance;
        if (!isFreeEntrance) {
          updateData.entranceFee = Number(entranceFee.replace(/,/g, ''));
        }
      } else if (!isFreeEntrance && entranceFee !== event.entranceFee?.toString()) {
        updateData.entranceFee = Number(entranceFee.replace(/,/g, ''));
      }

      // 참석자 정보 수집 관련
      if (receiveInfo !== event.receiveInfo) updateData.receiveInfo = receiveInfo;
      if (receiveName !== event.receiveName) updateData.receiveName = receiveName;
      if (receiveGender !== event.receiveGender) updateData.receiveGender = receiveGender;
      if (receivePhoneNumber !== event.receivePhoneNumber) updateData.receivePhoneNumber = receivePhoneNumber;
      if (receiveSNSId !== event.receiveSNSId) updateData.receiveSNSId = receiveSNSId;
      if (receiveMoney !== event.receiveMoney) updateData.receiveMoney = receiveMoney;

      // 예약금 관련
      if (depositAccount !== event.depositAccount) updateData.depositAccount = depositAccount;
      if (depositAmount !== event.depositAmount?.toString()) {
        updateData.depositAmount = receiveMoney && depositAmount ? Number(depositAmount.replace(/,/g, '')) : 0;
      }

      console.log('수정 데이터:', updateData); // 디버깅용

      // 변경된 필드가 있을 때만 요청 전송
      if (Object.keys(updateData).length > 0) {
        formData.append('eventUpdateRequestDTO', new Blob([JSON.stringify(updateData)], { type: 'application/json' }));
      } else {
        alert('변경된 내용이 없습니다.');
        return;
      }
    } else {
      // 생성 모드: 전체 데이터 전송
      const eventCreateRequestDTO = {
        venueId: venueId || 0, // venueId가 0이면 기본값 사용
        title,
        content,
        startDate: new Date(`${normalizedStartDate}T${startTime || '00:00'}:00`).toISOString(),
        endDate: new Date(`${normalizedEndDate}T${endTime || '00:00'}:00`).toISOString(),
        receiveInfo,
        receiveName,
        receiveGender,
        receivePhoneNumber,
        receiveTotalCount: Boolean(receiveTotalCount), // boolean으로 변환
        receiveSNSId,
        receiveMoney,
        depositAccount,
        depositAmount: receiveMoney && depositAmount ? Number(depositAmount.replace(/,/g, '')) : 0,
        entranceFee: isFreeEntrance ? 0 : Number(entranceFee.replace(/,/g, '')),
        entranceNotice: entranceNotice || '',
        notice: notice || '',
        freeEntrance: isFreeEntrance, // isFreeEntrance를 freeEntrance로 변경
        region,
        location,
      };

      formData.append(
        'eventCreateRequestDTO',
        new Blob([JSON.stringify(eventCreateRequestDTO)], { type: 'application/json' }),
      );
    }

    try {
      const url =
        isEditMode && eventId
          ? `${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}`
          : `${process.env.NEXT_PUBLIC_SERVER_URL}/events`;

      const method = isEditMode ? 'PATCH' : 'POST';

      console.log('Request Debug:', { url, method, isEditMode, eventId });

      const res = await fetch(url, {
        method,
        headers: {
          Access: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`${isEditMode ? '이벤트 수정' : '이벤트 생성'} 실패: ${res.status} - ${errorText}`);
      }

      const result = await res.json();

      console.log('Response Debug:', result);

      // 수정 모드 해제
      if (isEditMode) {
        setIsEditMode(false);
      }

      // 이전 페이지로 리다이렉트
      router.back();
    } catch (error) {
      console.error(`${isEditMode ? '이벤트 수정' : '이벤트 생성'} 에러:`, error);
    }
  };

  return (
    <div className="pb-10">
      <EventWriteHeader />
      <h1 className="px-5 py-2 text-[1.25rem] font-bold tracking-[-0.025rem] text-white">
        {isEditMode ? '이벤트를 수정해주세요!' : '다가오는 특별한 이벤트 소식을 전해주세요!'}
      </h1>

      <div className="flex flex-col gap-y-7">
        <ImageUploader
          onUpload={setUploadedImages}
          uploadedImages={uploadedImages}
          existingImages={isEditMode && event?.images ? event.images : []}
        />
        <EventTitleInput />
        <EventDateInput />
        <EventPlaceInput />
        <EventEntranceFee />
        <EventNoticeInput />
        <EventIntroInput />
        <EventRegisterStepForm />
      </div>
      <div className="flex px-5">
        <button
          disabled={!isFormValid}
          onClick={handleSubmit}
          className={`w-full rounded-[0.38rem] py-4 text-[0.875rem] font-bold ${
            isFormValid ? 'bg-main text-sub2 hover:bg-main' : 'bg-gray500 text-gray300'
          }`}>
          {isEditMode ? '이벤트 수정하기' : '이벤트 등록하기'}
        </button>
      </div>
    </div>
  );
}

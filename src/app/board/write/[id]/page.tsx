'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BoardWriteHeader from '@/components/units/Detail/Board/Write/BoardWriteHeader';
import BoardForm from '@/components/units/Detail/Board/Write/BoardForm';
import BoardSubmitButton from '@/components/units/Detail/Board/Write/BoardSubmitButton';
import { createPost } from '@/lib/actions/detail-controller/board/boardWriteUtils';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

const BoardWritePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueEngName = searchParams.get('venueEngName') || 'venueEngName';
  const venueLocation = searchParams.get('venueLocation') || '';
  const venueId = Number(searchParams.get('venueId')) || 0;

  const accessToken = useRecoilValue(accessTokenState);
  // 폼 데이터와 게시판 유형
  const [formData, setFormData] = useState({
    title: '',
    date: { year: '', month: '', day: '' },
    minParticipants: '',
    maxParticipants: '',
    cost: '',
    content: '',
    location: '',
    venue: '',
  });
  const [type, setType] = useState('free'); // 게시판 유형 상태 관리 (default: 자유 게시판)
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [step, setStep] = useState(1); // Step 상태 관리 (1: 작성 중, 2: 완료 화면)

  // 초기값 설정
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      location: venueLocation,
      venue: venueEngName,
    }));
  }, [venueEngName, venueLocation]);

  // 폼 데이터 업데이트 핸들러
  const handleFormChange = (field: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // 게시판 유형 업데이트 핸들러
  const handleTypeChange = (selectedType: string) => {
    setType(selectedType); // 게시판 유형 업데이트
  };

  // 게시글 제출 핸들러
  const handleSubmit = async () => {
    try {
      await createPost(type, {
        type,
        title: formData.title,
        content: formData.content,
        images: uploadedImages,
        venueId,
      },accessToken);
      setStep(2); // 완료 화면으로 이동
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    return (
      formData.title.trim() &&
      formData.minParticipants.trim() &&
      formData.maxParticipants.trim() &&
      formData.cost.trim() &&
      formData.content.trim() &&
      formData.location.trim() &&
      formData.venue.trim()
    );
  };

  // Step별 렌더링
  const renderContent = () => {
    if (step === 1) {
      return (
        <>
          <BoardForm
            formData={formData}
            onFormChange={handleFormChange}
            onTypeChange={handleTypeChange} // 게시판 유형 전달
          />
          <BoardSubmitButton
            onClick={handleSubmit}
            isDisabled={!isFormValid()} // 유효성 검사
          />
        </>
      );
    }

    if (step === 2) {
      return (
        <div
          className="mt-40 flex flex-col items-center justify-center bg-BG-black text-center"
          onClick={() => router.push(`/board/${venueId}`)} // 완료 후 이동
          style={{ cursor: 'pointer' }}
        >
          <h2 className="text-title-24-bold text-main">게시글이 등록되었습니다!</h2>
          <p className="mt-4 text-body2-15-medium text-gray300">
            {venueEngName}에 대한 소중한 게시글을 공유해주셔서 감사합니다.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen bg-BG-black text-white">
      <BoardWriteHeader title={`${venueEngName}`} currentStep={step} totalSteps={2} />
      {renderContent()}
    </div>
  );
};

export default BoardWritePage;

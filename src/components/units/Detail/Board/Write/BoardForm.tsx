'use client';

import { useState } from 'react';
import WriteDropdown from './WriteDropdown'; // WriteDropdown 컴포넌트
import WriteField from './WriteField'; // WriteField 컴포넌트

interface FormValues {
  [key: string]: string;
  title: string;
  year: string;
  month: string;
  day: string;
  minParticipants: string;
  maxParticipants: string;
  cost: string;
  content: string;
  location: string; // 지역 추가
  venue: string; // 베뉴 추가
}

const years = Array.from({ length: 10 }, (_, i) => (2024 + i).toString());
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const locations = ['서울', '부산', '대구', '광주', '대전', '수원']; // 지역 옵션
const venues = ['카페', '도서관', '공원', '스포츠 센터', '기타']; // 베뉴 옵션

const BoardForm = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    title: '',
    year: '',
    month: '',
    day: '',
    minParticipants: '',
    maxParticipants: '',
    cost: '',
    content: '',
    location: '', // 초기값
    venue: '', // 초기값
  });

  const [boardType, setBoardType] = useState('자유 게시판');
  const boardOptions = ['자유 게시판', '조각 게시판'];

  const handleInputChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-BG-black px-4 py-6 text-white">
      {/* 게시판 선택 */}
      <div className="relative mb-7">
        <WriteDropdown value={boardType} options={boardOptions} onChange={(value) => setBoardType(value)} />
      </div>
      {boardType === '조각 게시판' && (
        <>
          {/* 지역 및 베뉴 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">지역 및 베뉴</label>
            <div className="grid grid-cols-2 gap-4">
              <WriteDropdown
                value={formValues.location}
                options={locations}
                onChange={(value) => handleInputChange('location', value)}
                placeholder="지역 선택"
                px="px-4"
                py="py-3"
              />
              <WriteDropdown
                value={formValues.venue}
                options={venues}
                onChange={(value) => handleInputChange('venue', value)}
                placeholder="베뉴 선택"
                px="px-4"
                py="py-3"
              />
            </div>
          </div>

          {/* 글 제목 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">글 제목</label>
            <WriteField
              value={formValues.title}
              onChange={(value) => handleInputChange('title', value)}
              placeholder="글 제목을 입력해주세요."
            />
          </div>

          {/* 모집 일자 */}
          <div className="mb-5">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">모집 일자</label>
            <div className="flex items-center justify-between">
              <WriteDropdown
                value={formValues.year}
                options={years}
                onChange={(value) => handleInputChange('year', value)}
                placeholder="0000"
              />
              <span className="text-gray300">년</span>
              <WriteDropdown
                value={formValues.month}
                options={months}
                onChange={(value) => handleInputChange('month', value)}
              />
              <span className="text-gray300">월</span>
              <WriteDropdown
                value={formValues.day}
                options={days}
                onChange={(value) => handleInputChange('day', value)}
              />
              <span className="text-gray300">일</span>
            </div>
          </div>

          {/* 총 인원 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">총 인원</label>
            <div className="flex items-center justify-between">
              <span className="text-gray300">최소</span>
              <WriteDropdown
                value={formValues.minParticipants}
                options={Array.from({ length: 100 }, (_, i) => (i + 1).toString())}
                onChange={(value) => handleInputChange('minParticipants', value)}
              />
              <span className="text-gray300">명부터</span>
              <span className="text-gray300">최대</span>
              <WriteDropdown
                value={formValues.maxParticipants}
                options={Array.from({ length: 100 }, (_, i) => (i + 1).toString())}
                onChange={(value) => handleInputChange('maxParticipants', value)}
              />
              <span className="text-gray300">명까지</span>
            </div>
          </div>

          {/* 총 비용 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">총 비용</label>

            <WriteField
              value={formValues.cost}
              onChange={(value) => handleInputChange('cost', value)}
              placeholder="총 비용을 입력해주세요."
            />
          </div>
        </>
      )}

      {/* 글쓰기 */}
      <div className="mb-6">
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">글쓰기</label>
        <WriteField
          value={formValues.content}
          onChange={(value) => handleInputChange('content', value)} // 수정된 핸들러
          className="w-full rounded-xs border border-gray300 bg-gray700 px-4 py-3 text-gray100 placeholder-gray300 focus:border-main focus:outline-none"
          placeholder="글 내용을 입력해주세요."></WriteField>
      </div>
    </div>
  );
};

export default BoardForm;

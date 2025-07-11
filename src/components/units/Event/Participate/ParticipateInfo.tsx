'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useRecoilValue } from 'recoil';
import { eventState } from '@/context/recoil-context';
import EventDetailHeader from '@/components/units/Event/Detail/EventDetailHeader';
import { useRouter } from 'next/navigation';

interface Participant {
  eventId: number;
  memberId: number;
  name: string;
  gender: string;
  phoneNumber: string;
  isPaid: boolean;
  totalMember: number;
  createdAt: string;
}

export default function ParticipateInfo({ participants }: { participants?: Participant[] }) {
  const event = useRecoilValue(eventState);
  const router = useRouter();

  const dataToShow = useMemo(() => {
    if (participants && participants.length > 0) return participants;
    return [
      {
        eventId: 1,
        memberId: 101,
        name: '김민아',
        gender: '여',
        phoneNumber: '010 3236 2869',
        isPaid: true,
        totalMember: 1,
        createdAt: '2025-07-10',
      },
      {
        eventId: 1,
        memberId: 102,
        name: '박철수',
        gender: '남',
        phoneNumber: '010 3236 2869',
        isPaid: true,
        totalMember: 1,
        createdAt: '2025-07-10',
      },
      {
        eventId: 1,
        memberId: 103,
        name: '-',
        gender: '-',
        phoneNumber: '010 3236 2869',
        isPaid: false,
        totalMember: 1,
        createdAt: '2025-07-10',
      },
    ];
  }, [participants]);

  const handleDownloadExcel = () => {
    const wsData = [
      ['이름', '성별', '전화번호'],
      ...dataToShow.map((p) => [p.name || '-', p.gender || '-', p.phoneNumber || '-']),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '참석자');
    XLSX.writeFile(wb, `${event?.title || '이벤트'}_참석자_정보.xlsx`);
  };

  return (
    // 바깥 전체 wrapper는 무조건 w-full
    <div className="relative flex min-h-screen flex-col bg-BG-black">
      {/* 상단 고정 헤더 */}
      <div className="fixed left-0 top-0 z-30 w-full">
        <EventDetailHeader handleBackClick={() => router.push(`/event/${event?.eventId}`)} />
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-[3.5rem]">
        {/* 내용은 중앙 + 폭 제한 */}
        <div className="mx-auto w-full max-w-[600px] items-center">
          <h2 className="text-xl font-bold text-white">
            총 <span className="text-main">{dataToShow.length}</span>명 참석
          </h2>

          <div className="mt-6 w-full text-sm text-gray100">
            {/* 라벨 (그리드 바깥) */}
            <div className="mb-2 grid grid-cols-3 text-center font-semibold text-white">
              <div className="pl-4 text-left">이름</div>
              <div className="pl-4 text-left">성별</div>
              <div className="pl-4 text-left">전화번호</div>
            </div>

            {/* 실제 내용 - 각 column 너비 다르지만 합쳐서 w-full */}
            <div className="flex w-full gap-2">
              {/* 이름 column */}
              <div className="flex flex-1 flex-col gap-4 rounded-md bg-gray700 px-4 py-4 text-center">
                {dataToShow.map((p, i) => (
                  <div key={`name-${i}`} className="whitespace-nowrap">
                    {p.name || '-'}
                  </div>
                ))}
              </div>

              {/* 성별 column */}
              <div className="flex flex-[0.5] flex-col gap-4 rounded-md bg-gray700 px-4 py-4 text-center">
                {dataToShow.map((p, i) => (
                  <div key={`gender-${i}`} className="whitespace-nowrap">
                    {p.gender || '-'}
                  </div>
                ))}
              </div>

              {/* 전화번호 column */}
              <div className="flex flex-[1.5] flex-col gap-4 rounded-md bg-gray700 px-4 py-4 text-center">
                {dataToShow.map((p, i) => (
                  <div key={`phone-${i}`} className="whitespace-nowrap">
                    {p.phoneNumber || '-'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-5 left-0 right-0 z-30 px-[1.25rem]">
        <div className="mx-auto w-full max-w-[560px]">
          <button
            onClick={handleDownloadExcel}
            className="w-full rounded-md border-none bg-main py-4 text-[1rem] font-bold text-sub2">
            Excel 파일 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}

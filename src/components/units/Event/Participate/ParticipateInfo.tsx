'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useRecoilValue } from 'recoil';
import { eventState } from '@/context/recoil-context';
import EventDetailHeader from '@/components/units/Event/Detail/EventDetailHeader';
import { useRouter } from 'next/navigation';
import NoResults from '@/components/units/Search/NoResult';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const eventId = event?.eventId || pathname.split('/')[2];
  const dataToShow = useMemo(() => {
    return participants ?? [];
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
    <div className="relative flex min-h-screen flex-col bg-BG-black">
      {/* 상단 고정 헤더 */}
      <div className="fixed left-0 top-0 z-30 w-full">
        <EventDetailHeader handleBackClick={() => router.push(`/event/${eventId}`)} />
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-[3.5rem]">
        <div className="mx-auto w-full max-w-[600px]">
          <h2 className="text-xl font-bold text-white">
            총 <span className="text-main">{dataToShow.length}</span>명 참석
          </h2>

          {dataToShow.length > 0 ? (
            <div className="mt-6 w-full text-sm text-gray100">
              {/* 헤더 */}
              <div className="mb-2 grid grid-cols-3 text-center font-semibold text-white">
                <div className="pl-4 text-left">이름</div>
                <div className="pl-4 text-left">성별</div>
                <div className="pl-4 text-left">전화번호</div>
              </div>

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
          ) : (
            <NoResults text="참석자가 없습니다." />
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      {dataToShow.length > 0 && (
        <div className="fixed bottom-5 left-0 right-0 z-30 px-[1.25rem]">
          <div className="mx-auto w-full max-w-[560px]">
            <button
              onClick={handleDownloadExcel}
              className="w-full rounded-md border-none bg-main py-4 text-[1rem] font-bold text-sub2">
              Excel 파일 다운로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

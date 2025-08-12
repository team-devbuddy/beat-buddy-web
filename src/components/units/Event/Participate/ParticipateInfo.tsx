'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useRecoilValue } from 'recoil';
import { eventState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';
import NoResults from '@/components/units/Search/NoResult';
import { usePathname } from 'next/navigation';
interface Participant {
  eventId: number;
  memberId: number;
  name: string;
  gender: string;
  snsType?: string;
  snsId?: string;
  phoneNumber: string;
  isPaid: boolean;
  totalMember: number;
  createdAt: string;
}

export default function ParticipateInfo({ participants }: { participants?: Participant | Participant[] }) {
  const event = useRecoilValue(eventState);
  const router = useRouter();
  const pathname = usePathname();
  const eventId = event?.eventId || pathname.split('/')[2];

  const dataToShow = useMemo(() => {
    if (!participants) return [];
    // 단일 객체인 경우 배열로 변환, 이미 배열인 경우 그대로 사용
    return Array.isArray(participants) ? participants : [participants];
  }, [participants]);

  // 디버깅용 로그
  console.log('participants prop:', participants);
  console.log('dataToShow:', dataToShow);

  const handleDownloadExcel = () => {
    // 서버에서 받은 전체 데이터 사용 (화면에 보이는 것과 관계없이)
    const allParticipants = Array.isArray(participants) ? participants : participants ? [participants] : [];

    const wsData = [
      ['이벤트ID', '회원ID', '이름', '성별', 'SNS 타입', 'SNS ID', '전화번호', '결제여부', '총 인원', '등록일시'],
      ...allParticipants.map((p) => [
        p.eventId || '-',
        p.memberId || '-',
        p.name || '-',
        p.gender || '-',
        p.snsType || '-',
        p.snsId || '-',
        p.phoneNumber || '-',
        p.isPaid ? '결제완료' : '미결제',
        p.totalMember || '-',
        p.createdAt ? new Date(p.createdAt).toLocaleString('ko-KR') : '-',
      ]),
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
        <div className="mx-auto flex max-w-[600px] items-center px-[0.63rem] pb-[0.53rem] pt-[0.53rem]">
          <Image
            src="/icons/participateBack.svg"
            alt="뒤로가기"
            width={35}
            height={35}
            onClick={() => router.push(`/event/${eventId}`)}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-[3.5rem]">
        <div className="mx-auto w-full max-w-[600px]">
          <h2 className="text-title-24-bold text-white">
            총 <span className="text-main">{dataToShow.length}</span>명 참석
          </h2>

          {dataToShow.length > 0 ? (
            <div className="mt-6 w-full text-gray200">
              <div className="flex w-full gap-[0.44rem]">
                {/* 이름 컬럼 세트 */}
                <div className="flex flex-1 flex-col">
                  <div className="mb-2 text-center text-body1-16-bold text-white">이름</div>
                  <div className="flex flex-col gap-4 rounded-[0.63rem] bg-gray700 py-[0.94rem] pl-[1.44rem] pr-[1.37rem] text-center">
                    {dataToShow.map((p, i) => (
                      <div key={`name-${i}`} className="text-body-14-medium whitespace-nowrap">
                        {p.name || '-'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 성별 컬럼 세트 */}
                <div className="flex flex-[0.5] flex-col">
                  <div className="mb-2 text-center text-body1-16-bold text-white">성별</div>
                  <div className="flex flex-col gap-4 rounded-[0.63rem] bg-gray700 py-[0.94rem] pl-[1.38rem] pr-[1.31rem] text-center">
                    {dataToShow.map((p, i) => (
                      <div key={`gender-${i}`} className="text-body-14-medium whitespace-nowrap">
                        {p.gender || '-'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 전화번호 컬럼 세트 */}
                <div className="flex flex-[1.5] flex-col">
                  <div className="mb-2 text-center text-body1-16-bold text-white">전화번호</div>
                  <div className="flex flex-col gap-4 rounded-[0.63rem] bg-gray700 py-[0.94rem] pl-[2.31rem] pr-[2.35rem] text-center">
                    {dataToShow.map((p, i) => (
                      <div key={`phone-${i}`} className="text-body-14-medium whitespace-nowrap">
                        {p.phoneNumber || '-'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NoResults text="참석자가 없습니다" />
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      {dataToShow.length > 0 && (
        <div className="fixed bottom-5 left-0 right-0 z-30 px-[1.25rem]">
          <div className="mx-auto w-full max-w-[560px]">
            <button
              onClick={handleDownloadExcel}
              className="w-full rounded-md border-none bg-main py-[0.88rem] text-[1rem] font-bold text-sub2">
              Excel 파일 다운로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

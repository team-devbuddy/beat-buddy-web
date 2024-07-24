'use client';
import { ArchiveHistoryProps } from '@/lib/types';

interface HistoryProps {
  data: ArchiveHistoryProps;
}

export default function History({ data }: HistoryProps) {
  // 날짜 형식을 'YYYY-MM-DDTHH:mm:ss.ssssss'에서 'MM.DD'로 변환하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
    const day = date.getDate();
    return `${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
  };

  // 배경 이미지를 조건부로 반환하는 함수
  const getBackgroundImage = (preference: string) => {
    switch (preference) {
      case 'HIP':
        return '/images/onBoarding/background/onboarding-1.png';
      case 'DISCO':
        return '/images/onBoarding/background/onboarding-2.png';
      case 'R&B':
        return '/images/onBoarding/background/onboarding-3.png';
      case 'TECHNO':
        return '/images/onBoarding/background/onboarding-4.png';
      case 'EDM':
        return '/images/onBoarding/background/onboarding-5.png';
      case 'HOUSE':
        return '/images/onBoarding/background/onboarding-6.png';
      case 'LATIN':
        return '/images/onBoarding/background/onboarding-7.png';
      case 'SOUL&FUNK':
        return '/images/onBoarding/background/onboarding-8.png';
      default:
        return '/images/onBoarding/background/default.png'; // 기본 이미지
    }
  };

  return (
    <>
      {/* MyHistory Card */}
      <div
        className="flex h-[15.6rem] w-[20rem] flex-shrink-0 flex-col justify-between rounded-[0.38rem] bg-[#242730] px-4 py-6"
        style={{
          backgroundImage: `url(${getBackgroundImage(data.preferenceList[0])})`,
        }}>
        <p className="font-queensides text-[2.5rem] font-light text-white">{formatDate(data.updatedAt)}</p>
        <div className="flex flex-wrap gap-2">
          {data.preferenceList.map((preference, index) => (
            <div key={index} className="rounded-[0.13rem] bg-gray500 px-[0.38rem] py-[0.12rem] text-gray100">
              {preference}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

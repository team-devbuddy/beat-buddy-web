'use client';
import Prev from '@/components/common/Prev';
import { useRouter } from 'next/navigation';

export default function LocationTerms() {
  const router = useRouter();
  return (
    <div className="scrollbar-none w-full">
      <Prev url={'/onBoarding'} />
      <div className="scrollbar-none flex w-full flex-col px-5">
        <h1 className="mb-[1.88rem] pt-[0.62rem] text-title-24-bold text-white">위치 정보 사용 동의</h1>
        <div className="scrollbar-none flex flex-col gap-[1.88rem] overflow-y-auto">
          <p className="text-body2-15-medium text-white">1. 위치정보 수집·이용 목적</p>
          <p className="text-body2-15-medium text-white">위치 정보 사용 동의 내용을 확인해주세요.</p>
        </div>
        <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
          <button
            onClick={() => router.back()}
            className={`w-full max-w-md rounded-[0.5rem] bg-gray500 py-4 text-[1rem] font-bold text-white transition-colors`}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

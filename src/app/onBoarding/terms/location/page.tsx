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
        <div className="scrollbar-none flex flex-col gap-[1.88rem] overflow-y-auto pb-24">
          <div className="text-body-14-medium text-gray100">
            <h2 className="mb-3 text-button-16-semibold text-gray100">제1조 (위치정보 수집 항목)</h2>
            <div className="space-y-3">
              <p>회사는 다음과 같은 방식으로 위치정보를 수집할 수 있습니다:</p>
              <div className="ml-4 space-y-1">
                <p>1. 단말기의 GPS, Wi-Fi, 또는 기지국 정보를 활용하여 실시간 위치 좌표를 수집합니다.</p>
                <p>2. 위치정보는 서비스 실행 중 자동으로 수집되며, 본 서비스 이용을 위해 위치정보 제공은 필수입니다.</p>
              </div>
            </div>
          </div>

          <div className="text-body-14-medium text-gray100">
            <h2 className="mb-3 text-button-16-semibold text-gray100">제2조 (이용 목적)</h2>
            <div className="space-y-3">
              <p>회사는 위치정보를 아래와 같은 목적으로 활용합니다:</p>
              <div className="ml-4 space-y-1">
                <p>1. 사용자 주변 베뉴 추천 기능</p>
                <p>2. 거리순 정렬, 혼잡도 예측 알고리즘에 활용</p>
                <p>3. 위치 기반 실시간 푸시알림 (예: "오늘자 이태원 추천 파티!")</p>
              </div>
            </div>
          </div>

          <div className="text-body-14-medium text-gray100">
            <h2 className="mb-3 text-button-16-semibold text-gray100">제3조 (보유 기간 및 파기)</h2>
            <div className="space-y-1">
              <p>1. 실시간 위치정보는 수집 즉시 사용되며 저장하지 않습니다.</p>
              <p>2. 통계 분석을 위해 비식별화된 로그는 최대 30일간 보관합니다.</p>
            </div>
          </div>

          <div className="text-body-14-medium text-gray100">
            <h2 className="mb-3 text-button-16-semibold text-gray100">제4조 (이용자의 권리)</h2>
            <div className="space-y-1">
              <p>1. 이용자는 언제든지 위치정보 수집 동의를 철회할 수 있습니다.</p>
              <p>2. 동의 철회 시 "내 주변" 기반 추천, 거리순 필터 등 일부 기능 사용이 제한될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import Prev from '@/components/common/Prev';
import { useRouter } from 'next/navigation';

export default function MarketingTerms() {
  const router = useRouter();
  return (
    <div className="scrollbar-none w-full">
      <Prev url={'/onBoarding'} />
      <div className="scrollbar-none flex w-full flex-col px-5">
        <h1 className="mb-[1.88rem] pt-[0.62rem] text-title-24-bold text-white">마케팅 수신 동의</h1>
        <div className="scrollbar-none flex flex-col gap-[1.88rem] overflow-y-auto pb-24">

          <div className="text-[0.875rem] text-gray100">
            <h2 className="text-4 mb-4 font-bold text-gray100">제1조 (수신 정보 항목)</h2>
            <div className="space-y-3">
              <p>회사는 회원에게 유용한 정보를 제공하기 위해 아래 항목의 광고성 정보를 발송할 수 있습니다:</p>
              <div className="ml-4 space-y-2">
                <p>1. 베뉴 및 제휴 이벤트 알림</p>
                <p>2. 할인 쿠폰, 제휴 프로모션, 바틀/테이블 구매 혜택</p>
                <p>3. 커뮤니티 인기글, 이벤트 및 타임테이블 정보</p>
                <p>4. 앱 주요 업데이트 및 기능 소개</p>
              </div>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="text-4 mb-4 font-bold text-gray100">제2조 (발송 수단)</h2>
            <div className="space-y-3">
              <p>회사는 다음과 같은 채널을 통해 광고성 정보를 발송할 수 있습니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 앱 푸시알림</p>
                <p>- 카카오 알림톡</p>
                <p>- 이메일</p>
                <p>- SMS / LMS 문자</p>
              </div>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="text-4 mb-4 font-bold text-gray100">제3조 (철회 및 설정 변경)</h2>
            <div className="space-y-3">
              <p>1. 회원은 아래 방법을 통해 마케팅 수신 동의를 언제든지 철회할 수 있습니다:</p>
              <div className="ml-4 space-y-3">
                <p>- 앱 내 [마이페이지] &gt; [설정] &gt; [문의 사항] &gt; [문의 방법 선택] 메뉴를 통해 철회 요청</p>
                <p className="ml-4">(카카오톡 채널, 인스타그램 DM, 이메일 beatbuddykr@gmail.com 중 선택 가능)</p>
                <p>- 카카오 알림톡 또는 문자 메시지 하단의 [수신거부] 또는 [수신차단] 클릭</p>
              </div>
              <p>
                2. 단, 서비스 운영상 반드시 고지되어야 하는 정보(예: 약관 변경, 시스템 점검, 서비스 종료 등)는 동의
                여부와 관계없이 발송될 수 있습니다.
              </p>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="text-4 mb-4 font-bold text-gray100">제4조 (기타사항)</h2>
            <div className="space-y-3">
              <p>1. 마케팅 수신 동의 여부는 선택사항이며, 미동의 시에도 서비스 이용에는 제한이 없습니다.</p>
              <p>2. 회사는 수신 동의 시 명확한 수신 주체, 철회 방법을 고지합니다.</p>
            </div>
          </div>
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

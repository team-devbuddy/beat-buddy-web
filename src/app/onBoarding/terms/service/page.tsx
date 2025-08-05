'use client';
import Prev from '@/components/common/Prev';
import { useRouter } from 'next/navigation';
export default function ServiceTerms() {
  const router = useRouter();
  return (
    <div className="scrollbar-none w-full">
      <Prev url={'/onBoarding'} />
      <div className="scrollbar-none flex w-full flex-col px-5">
        <h1 className="mb-[1.88rem] pt-[0.62rem] text-title-24-bold text-white">서비스 이용약관 동의</h1>
        <div className="scrollbar-none flex flex-col gap-[1.88rem] overflow-y-auto pb-24">
          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제1조 (목적)</h2>
            <p className="mb-6">
              본 약관은 주식회사 비트버디(이하 "회사")가 운영하는 BeatBuddy 서비스(이하 "서비스")의 이용 조건 및 절차,
              이용자와 회사의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제2조 (용어 정의)</h2>
            <div className="space-y-3">
              <p>
                1. "서비스"란 회사가 제공하는 클럽, 루프탑, 라운지 등 음악 중심 베뉴 정보의 검색, 명단 작성, 쿠폰, 후기
                작성, 커뮤니티 기능, 예약 및 결제 등 통합 플랫폼을 의미합니다.
              </p>
              <p>2. "회원"이란 서비스에 가입하여 회사와 이용계약을 체결한 개인 또는 법인을 말합니다.</p>
              <p>3. "게시물"이란 회원이 서비스 내 작성하거나 등록한 글, 사진, 영상 등 일체의 콘텐츠를 말합니다.</p>
              <p>
                4. "비즈니스 회원"이란 회사 플랫폼을 통해 명단, 테이블, 티켓 판매, 바틀 판매 등을 진행하는 베뉴/이벤트
                운영 주체를 말합니다.
              </p>
              <p>
                5. "이벤트"란 베뉴, 기획사, 비즈니스 회원 등이 주최하는 공연, 파티, DJ 셋, 페스티벌 등 일체의 오프라인
                행사입니다.
              </p>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제3조 (약관의 효력 및 변경)</h2>
            <div className="space-y-3">
              <p>1. 본 약관은 서비스 초기 화면에 게시하거나, 기타의 방법으로 공지함으로써 효력이 발생합니다.</p>
              <p>2. 회사는 관련 법령에 위배되지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.</p>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제4조 (회원가입 및 이용계약 체결)</h2>
            <div className="space-y-3">
              <p>1. 회원가입은 이용자가 약관에 동의하고, 가입신청에 대한 회사의 승낙으로 이루어집니다.</p>
              <p>2. 회사는 다음 각 호에 해당하는 경우 이용신청을 거부하거나 사후에 계약을 해지할 수 있습니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 타인의 명의 또는 정보를 도용한 경우</p>
                <p>- 반복적인 예약 노쇼 또는 허위 명단 작성 등 서비스 질서 훼손</p>
                <p>- 불법적 게시물 다수 등록 및 신고 누적 등 운영 방해</p>
              </div>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제5조 (서비스 내용)</h2>
            <div className="space-y-3">
              <p>1. 회사는 회원에게 다음 각 호의 서비스를 제공합니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 지역/장르/분위기 기반 베뉴 큐레이션 및 검색</p>
                <p>- 지도 기반 베뉴 상세 정보</p>
                <p>- 이벤트 정보 제공 및 참석 명단 작성</p>
                <p>- 후기, 리뷰, 사진 게시 등의 콘텐츠 작성</p>
                <p>- 커뮤니티 게시판</p>
                <p>- 이벤트 알림, 마케팅 혜택 안내, 개인화 추천 등</p>
                <p>- 테이블 예약, 티켓 구매, 바틀 구매 등의 입장 관련 기능 (예정)</p>
                <p>- 실시간 혼잡도 기반 입장 현황 제공 (예정)</p>
                <p>- DJ/공연자 프로필 조회 및 팔로우, 메시지 등 소셜 기능 (예정)</p>
              </div>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제6조 (이용 제한 및 계약 해지)</h2>
            <div className="space-y-3">
              <p>1. 회원은 언제든지 서비스 내 설정을 통해 탈퇴할 수 있습니다.</p>
              <p>2. 회사는 다음 각 호에 해당하는 경우 사전 통지 없이 이용을 제한하거나 계약을 해지할 수 있습니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 타인 명예 훼손, 음란·불법 게시물 업로드</p>
                <p>- 명단 도용, 예약 취소 반복 등 운영 방해 행위</p>
                <p>- 위치 조작 프로그램 등을 통한 비정상 접속</p>
              </div>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제7조 (게시물 관리 및 저작권)</h2>
            <div className="space-y-3">
              <p>1. 게시물의 저작권은 회원 본인에게 있으나, 회사는 운영·홍보 목적상 비상업적 사용 권한을 가집니다.</p>
              <p>2. 회사는 아래 유형에 해당하는 게시물을 사전 고지 없이 삭제할 수 있습니다:</p>
              <div className="ml-4 space-y-2">
                <p>- 법령 위반, 타인 권리 침해, 혐오·차별적 내용</p>
                <p>- 도배성, 상업적 광고 또는 바이럴 게시물</p>
              </div>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제8조 (개인정보 수집 및 활용)</h2>
            <div className="space-y-3">
              <p>
                1. 회사는 서비스 제공에 필요한 최소한의 개인정보를 수집하며, 수집 항목과 목적은 회원 유형에 따라 다음과
                같습니다:
              </p>

              <div className="ml-4 space-y-4">
                <div>
                  <p className="font-semibold">① 일반 회원</p>
                  <div className="ml-4 mt-2 space-y-2">
                    <p>- 수집 항목: 소셜 로그인 연동 ID, 프로필 이미지, 이메일(해당 플랫폼에서 제공한 경우)</p>
                    <p>- 수집 목적: 로그인 인증, 맞춤형 베뉴 큐레이션, 커뮤니티 활동, 후기 작성 등</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold">② 비즈니스 회원</p>
                  <div className="ml-4 mt-2 space-y-2">
                    <p>
                      - 수집 항목: 이름, 생년월일, 휴대전화번호, 소셜 로그인 연동 ID, 프로필 이미지, 이메일(해당
                      플랫폼에서 제공한 경우) 등
                    </p>
                    <p>- 수집 목적: 제휴 베뉴 등록 및 관리, 이벤트 등록 및 참석 명단 수집, 커뮤니티 활동 등</p>
                  </div>
                </div>
              </div>

              <p>
                2. 회원이 제공한 개인정보는 수집 목적 달성 시 또는 회원 탈퇴 후 관련 법령에 따라 일정 기간 보관 후
                안전하게 파기합니다.
              </p>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제9조 (서비스 변경·중단)</h2>
            <div className="space-y-3">
              <p>
                1. 회사는 서비스 운영상 또는 기술상 불가피한 사유가 있는 경우 일부 기능의 제공을 변경하거나 종료할 수
                있으며, 이 경우 사전 공지합니다.
              </p>
              <p>2. 유료 서비스의 변경·중단 시 회원에게 사전 고지 및 환불 처리 기준을 따릅니다.</p>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제10조 (면책 조항)</h2>
            <div className="space-y-3">
              <p>1. 회사는 회원 간, 회원과 업장 간 발생한 거래·분쟁 등에 개입하지 않으며, 책임을 지지 않습니다.</p>
              <p>2. 정보성 글, 후기 등 사용자 콘텐츠는 주관적 정보이며, 그 신뢰성은 회원의 책임입니다.</p>
            </div>
          </div>

          <div className="text-[0.875rem] text-gray100">
            <h2 className="mb-4 text-4 font-bold text-gray100">제11조 (분쟁해결 및 관할)</h2>
            <p>
              1. 회사와 회원 간 발생한 분쟁에 대하여 성실히 협의하며, 분쟁 해결이 어려울 경우 서울중앙지방법원을 관할로
              합니다.
            </p>
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

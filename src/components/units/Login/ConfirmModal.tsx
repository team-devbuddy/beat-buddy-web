'use client';

import { useRouter } from 'next/navigation';

interface Props {
  onClose: () => void;
  loginType: 'kakao' | 'google' | 'apple';
}

export default function ConfirmedModal({ onClose, loginType }: Props) {
  const router = useRouter();

  const providerNameMap: Record<typeof loginType, string> = {
    kakao: '카카오',
    google: '구글',
    apple: '애플',
  };

  const handleConfirm = () => {
    onClose();
    // ✅ 비즈니스 유저는 userType 쿼리 포함
    router.push('/onBoarding?userType=business');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[320px] rounded-md bg-BG-black px-6 pb-6 pt-8 text-center text-white shadow-xl">
        <p className="mb-2 text-subtitle-20-bold">{providerNameMap[loginType]} 계정으로 확인되었어요</p>
        <p className="mb-[1.56rem] text-body2-15-medium text-gray200">비즈니스 등록 및 연락처 인증을 완료해주세요</p>
        <button
          onClick={handleConfirm}
          className="w-full rounded-md bg-main py-2 text-body2-15-medium font-semibold text-white transition hover:bg-[#e5006e]">
          확인
        </button>
      </div>
    </div>
  );
}

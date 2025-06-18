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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-BG-black text-white px-6 pt-8 pb-6 rounded-md w-[320px] text-center shadow-xl">
        <p className="text-subtitle-20-bold mb-2">
          {providerNameMap[loginType]} 계정으로 확인되었어요
        </p>
        <p className="text-body2-15-medium text-gray200 mb-[1.56rem]">
          비즈니스 등록 및 연락처 인증을 완료해주세요.
        </p>
        <button
          onClick={handleConfirm}
          className="w-full py-2 rounded-md bg-main text-body2-15-medium font-semibold text-white hover:bg-[#e5006e] transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}

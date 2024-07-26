import Prev from '@/components/common/Prev';
import Image from 'next/image';
import Link from 'next/link';

export default function CertComplete() {
  return (
    <div className="w-full">
      {/* <Prev url="/onboarding/cert" /> */}
      <div className="mt-[80px] flex w-full flex-col px-4">
        <h2 className="text-2xl font-bold text-white">인증을 완료했어요!</h2>
        <p className="mt-4 text-gray300">이제 모든 서비스를 자유롭게 이용하실 수 있어요</p>
      </div>

      <div className="mt-[6.56rem] flex h-full w-full justify-center">
        <Image src="/icons/complete.svg" width={224} height={224} alt="certComplete" />
      </div>

      <Link href="/onBoarding">
        <div className="absolute bottom-0 flex w-full cursor-pointer justify-center bg-main py-4 text-lg font-bold">
          완료
        </div>
      </Link>
    </div>
  );
}

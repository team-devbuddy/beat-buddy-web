
import Image from 'next/image';

export default function MaintenancePage() {
    return (
      <div className="flex h-screen px-4 items-center justify-center text-center bg-BG-black">
        <div className='flex flex-col items-center'>
          <Image src="/icons/MainLogo.svg" alt="logo" width={100} height={100} />
          <h1 className="mt-2 text-title-24-bold text-main font-bold">현재 서비스 점검 중입니다.</h1>
          <p className="mt-1  text-gray200">보다 나은 서비스를 위해 잠시 점검 중입니다. <br /> 빠른 시일 내에 다시 찾아뵙겠습니다.</p>
        </div>
      </div>
    );
  }
  
import Image from 'next/image';

export default function Landing4() {
  return (
    <div className="flex h-screen w-full flex-col justify-center bg-black px-6 py-[2.5rem]">
      <div className="flex flex-col">
        <div className="flex flex-col items-start gap-1">
          <p className="text-xs text-main">03. 쉬운 검색</p>
          <p className="font-bold text-white">검색해도 안 나오는 베뉴 정보</p>
          <p className="font-bold text-white">어디서 확인할 수 있을까요?</p>
        </div>

        <div className="flex w-full justify-center">
          <Image src="/images/onBoarding/Landing4-1.png" width={327} height={277} alt="123" className="mt-10" />
        </div>

        <div className="mt-10 flex w-full items-center justify-center bg-main px-5 py-[0.38rem] text-[0.93rem] text-black">
          한 눈에 <p className="text-[0.93rem] font-bold text-black">쉽고 빠른 검색</p>이 가능해요!{' '}
        </div>

        <div className="leading-12 mt-5 text-center text-xs text-white">
          음악, 분위기, 위치 등 베뉴 정보를 한 눈에 볼 수 있어요
        </div>
      </div>
    </div>
  );
}
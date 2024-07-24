import Image from 'next/image';

export default function Landing3() {
  return (
    <div
      style={{ backgroundImage: `url('/images/onBoarding/Landing3-bg.png')` }}
      className="flex h-screen min-h-screen w-full snap-mandatory snap-start snap-always flex-col justify-center bg-main px-6 py-[2.5rem]">
      <div className="flex flex-col">
        <div className="flex flex-col items-end gap-1">
          <p className="text-white">02. 맞춤형 추천</p>
          <p className="font-bold text-black">익숙한 베뉴에서 벗어나</p>
          <p className="font-bold text-black">새로운 베뉴에 가보고 싶으신가요?</p>
        </div>

        <div className="flex w-full justify-center">
          <Image src="/images/onBoarding/Landing3-1.png" width={327} height={277} alt="123" className="mt-10" />
        </div>

        <div className="mt-10 flex w-full justify-center bg-black px-5 py-[0.38rem] text-white">
          버디님 취향에 맞는 베뉴를 찾아드릴게요!
        </div>

        <div className="leading-12 mt-5 text-center text-xs">
          비트버디만의 온보딩 테스트를 이용해 버디님이 좋아하시는
          <br />
          음악, 분위기를 가진 베뉴를 추천해드려요
        </div>
      </div>
    </div>
  );
}

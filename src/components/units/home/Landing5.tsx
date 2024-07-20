import Image from 'next/image';

export default function Landing5() {
  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/onBoarding/Landing5.png')" }}>
      <div className="mb-[1.25rem] flex w-full justify-center">
        <Image src={'/images/onBoarding/Landing1.png'} alt="colored logo" width={221} height={125} />
      </div>
      <span className="mb-[1.25rem] text-body1-16-bold text-white">지금 나에게 맞는 베뉴를 추천 받고 싶나요?</span>
      <div className="flex cursor-pointer items-center justify-center rounded-full bg-main px-[1.25rem] py-[0.75rem] text-body3-12-bold text-BG-black">
        <span className="text-body2-15-bold">비트버디 시작하기</span>
      </div>
    </div>
  );
}

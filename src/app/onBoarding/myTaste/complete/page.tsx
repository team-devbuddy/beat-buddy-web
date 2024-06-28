import Link from 'next/link';

export default function OnBordingComplete() {
  return (
    <>
      <div className="flex w-full flex-col px-4 pt-[3.5rem]">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          수빈버디님을 위한
          <br />
          맞춤 베뉴를 찾았어요!
        </h1>
      </div>
      <Link href="/">
        <button
          className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${'bg-main text-BG-black'}`}>
          다음
        </button>
      </Link>
    </>
  );
}

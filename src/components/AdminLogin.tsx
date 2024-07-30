import Prev from './common/Prev';

export default function AdminLogin() {
  return (
    <>
      <div className="flex h-screen w-full flex-col items-center">
        <Prev url="/" />

        <div className="0 mt-28 flex w-[90%] flex-col items-center rounded-lg py-8 pb-4 pt-12">
          <div className="w-[80%]">
            <h1 className="text-[1.5rem] text-white">어드민 로그인</h1>
          </div>
          <input className="mt-[2.75rem] w-[80%] rounded-sm border-b border-white bg-BG-black px-2 py-4 text-white outline-none" />
          <button className="mt-3 w-[80%] bg-main py-3 text-xs font-semibold hover:brightness-105">로그인</button>
        </div>
      </div>
    </>
  );
}

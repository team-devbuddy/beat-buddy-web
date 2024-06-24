import Image from 'next/image';

export default function MainHeader() {
  return (
    <div className="flex w-full justify-between px-4 py-[0.44rem]">
      <Image src="/icons/logo.svg" alt="logo" width={42} height={40} />
      <button className="rounded-[0.13rem] bg-black px-2 py-[0.38rem] text-main2">Login</button>
    </div>
  );
}

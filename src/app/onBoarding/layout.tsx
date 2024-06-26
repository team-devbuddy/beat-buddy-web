import Image from 'next/image';

export default function OnBoardingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <nav className="w-full p-4">
        <Image src="/icons/backward.svg" alt="logo" width={24} height={24} className="cursor-pointer" />
      </nav>

      {children}
    </section>
  );
}

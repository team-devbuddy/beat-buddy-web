import Image from 'next/image';
import Link from 'next/link';

interface PrevProps {
  url: string;
}

export default function Prev({ url }: PrevProps) {
  return (
    <nav className="w-full p-4">
      <Link href={url}>
        <Image src="/icons/backward.svg" alt="logo" width={24} height={24} className="cursor-pointer" />
      </Link>
    </nav>
  );
}

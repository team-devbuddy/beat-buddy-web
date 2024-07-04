import Image from 'next/image';
import Link from 'next/link';

interface HeaderBackProps {
  url: string;
}

const HeaderBack: React.FC<HeaderBackProps> = ({ url }) => {
  return (
    <div className="flex items-center p-4">
      <Link href={url}>
        <Image src="/icons/backward.svg" alt="back" width={24} height={24} />
      </Link>
    </div>
  );
};

export default HeaderBack;

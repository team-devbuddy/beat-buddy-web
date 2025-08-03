import Image from 'next/image';
import Link from 'next/link';

interface HeaderBackProps {
  url: string;
}

const HeaderBack: React.FC<HeaderBackProps> = ({ url }) => {
  return (
    <div className="flex items-center px-5 pt-[0.62rem] pb-[0.88rem]">
      <Link href={url}>
        <Image src="/icons/arrow_back_ios.svg" alt="back" width={24} height={24} />
      </Link>
    </div>
  );
};

export default HeaderBack;

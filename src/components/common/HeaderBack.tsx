import Image from 'next/image';
import Link from 'next/link';

interface HeaderBackProps {
  url: string;
}

const HeaderBack: React.FC<HeaderBackProps> = ({ url }) => {
  return (
    <div className="flex items-center px-[0.63rem] py-[0.53rem]">
      <Link href={url}>
        <Image src="/icons/line-md_chevron-left.svg" alt="back" width={35} height={35} />
      </Link>
    </div>
  );
};

export default HeaderBack;

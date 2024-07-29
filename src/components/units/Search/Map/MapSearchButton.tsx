
import Image from 'next/image';

interface SearchButtonProps {
  onClick: () => void;
}

const MapSearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <div
      className="active:scale-95 fixed left-1/2 top-[6.3rem] z-10 flex cursor-pointer items-center justify-center rounded-full bg-gray600 px-[1.25rem] py-[0.75rem] transform -translate-x-1/2 transition duration-150 ease-in-out"
      onClick={onClick}>
      <div className="flex items-center justify-center w-6 h-6">
        <Image
          src="/icons/goforward.svg"
          alt="refresh icon"
          width={14.87}
          height={17.7}
        />
      </div>
      <span className="ml-2 text-main2 text-body3-12-bold">현 지도에서 검색</span>
    </div>
  );
};

export default MapSearchButton;

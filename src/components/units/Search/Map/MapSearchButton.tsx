import Image from 'next/image';

interface SearchButtonProps {
  onClick: () => void;
}

const MapSearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <div
      className="z-8.5 fixed left-1/2 top-[9rem] flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-gray600 px-[1.25rem] py-[0.75rem] transition duration-150 ease-in-out active:scale-95"
      onClick={onClick}>
      <div className="flex h-6 w-6 items-center justify-center">
        <Image src="/icons/goforward.svg" alt="refresh icon" width={14.87} height={17.7} />
      </div>
      <span className="ml-2 text-body3-12-bold text-main2">현 지도에서 검색</span>
    </div>
  );
};

export default MapSearchButton;

import Image from 'next/image';

interface SearchButtonProps {
  onClick: () => void;
}

const MapSearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <div
      className="z-8.5 fixed left-1/2 top-[4.75rem] flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full border border-main bg-sub2 px-[1.25rem] py-[0.75rem] transition duration-150 ease-in-out active:scale-95"
      onClick={onClick}>
      <div className="flex h-6 w-6 items-center justify-center">
        <Image src="/icons/goforward.svg" alt="refresh icon" width={14.87} height={17.7} />
      </div>
      <span className="ml-2 text-[0.875rem] font-bold text-main">현 지도에서 검색</span>
    </div>
  );
};

export default MapSearchButton;

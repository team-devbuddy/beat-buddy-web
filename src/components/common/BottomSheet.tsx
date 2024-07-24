'use client';
import { Sheet } from 'react-modal-sheet';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import VenueCardInfo from './component/VenueCardInfo';

export default function BottomSheetComponent() {
  const [height, setHeight] = useState<number>(500);
  const [isOpen, setOpen] = useState(false);
  const [isGenreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const genreDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateSnapPoints() {
      const calculateHeight = window.innerHeight - 141;
      setHeight(calculateHeight);
    }
    updateSnapPoints();
    window.addEventListener('resize', updateSnapPoints);
    return () => {
      window.removeEventListener('resize', updateSnapPoints);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target as Node)) ||
        (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node))
      ) {
        setGenreDropdownOpen(false);
        setLocationDropdownOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGenreClick = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null); // 이미 선택된 장르를 다시 클릭하면 선택 해제
    } else {
      setSelectedGenre(genre);
    }
    setGenreDropdownOpen(false);
  };

  const handleLocationClick = (location: string) => {
    if (selectedLocation === location) {
      setSelectedLocation(null); // 이미 선택된 위치를 다시 클릭하면 선택 해제
    } else {
      setSelectedLocation(location);
    }
    setLocationDropdownOpen(false);
  };

  const toggleGenreDropdown = () => {
    setGenreDropdownOpen((prev) => !prev);
    if (isLocationDropdownOpen) setLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen((prev) => !prev);
    if (isGenreDropdownOpen) setGenreDropdownOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <div className="pb-32">
        <Sheet
          className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
          isOpen={true}
          onClose={() => setOpen(false)}
          initialSnap={1}
          // 0: full screen, 1: 컨텐츠 한 개만, 2: 바텀시트 헤더만
          snapPoints={[height, 234, 74]}>
          <Sheet.Container className="relative h-full w-full !shadow-none">
            <Sheet.Header className="relative flex h-[40px] w-full justify-center rounded-t-lg bg-[#131415] pt-[6px]">
              <div className="mt-2 h-[0.25rem] w-[5rem] rounded-[2px] bg-gray500" />
            </Sheet.Header>
            <Sheet.Content
              className="relative z-10 h-full w-full !grow-0 overflow-y-scroll bg-[#131415]"
              disableDrag={true}>
              <div className="flex flex-col text-[0.93rem]">
                <div className="flex justify-between px-4 py-1">
                  <div className="flex gap-3">
                    <div
                      className={`relative z-50 flex cursor-pointer gap-2 rounded-sm px-[0.62rem] py-1 ${
                        selectedGenre === null ? 'bg-gray700' : 'bg-[#480522]'
                      }`}
                      onClick={toggleGenreDropdown}>
                      <div className={`text-gray300 ${selectedGenre === null ? 'text-gray300' : 'text-main2'}`}>
                        {selectedGenre === null ? '장르' : selectedGenre}
                      </div>
                      {selectedGenre === null ? (
                        <Image src="/icons/underPointer.svg" width={12} height={12} alt="under_point" />
                      ) : (
                        <Image src="/icons/pinkUnderPointer.svg" width={12} height={12} alt="under_point" />
                      )}

                      {isGenreDropdownOpen && (
                        <div
                          ref={genreDropdownRef}
                          className="absolute left-0 top-full mt-2 w-[13.75rem] rounded-md bg-gray700 shadow-lg">
                          {genres.map((genre) => (
                            <div
                              key={genre}
                              className={`flex cursor-pointer justify-between p-4 text-white hover:bg-gray500 ${
                                selectedGenre === genre ? 'text-main2' : ''
                              }`}
                              onClick={() => handleGenreClick(genre)}>
                              {genre}
                              {selectedGenre === genre && (
                                <Image src="/icons/pinkCheck.svg" width={12} height={12} alt="check" className="" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      className={`relative z-50 flex cursor-pointer gap-2 rounded-sm px-[0.62rem] py-1 ${
                        selectedLocation === null ? 'bg-gray700' : 'bg-[#480522]'
                      }`}
                      onClick={toggleLocationDropdown}>
                      <div className={`text-gray300 ${selectedLocation === null ? 'text-gray300' : 'text-main2'}`}>
                        {selectedLocation === null ? '위치' : selectedLocation}
                      </div>
                      {selectedLocation === null ? (
                        <Image src="/icons/underPointer.svg" width={12} height={12} alt="under_point" />
                      ) : (
                        <Image src="/icons/pinkUnderPointer.svg" width={12} height={12} alt="under_point" />
                      )}

                      {isLocationDropdownOpen && (
                        <div
                          ref={locationDropdownRef}
                          className="absolute left-0 top-full mt-2 w-[13.75rem] rounded-md bg-gray700 shadow-lg">
                          {locations.map((location) => (
                            <div
                              key={location}
                              className={`flex cursor-pointer justify-between p-4 text-white hover:bg-gray500 ${
                                selectedLocation === location ? 'text-main2' : ''
                              }`}
                              onClick={() => handleLocationClick(location)}>
                              {location}
                              {selectedLocation === location && (
                                <Image src="/icons/pinkCheck.svg" width={12} height={12} alt="check" className="" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex cursor-pointer gap-2 rounded-sm px-[0.5em] py-1">
                    <div className="text-gray300">가까운 순</div>
                    <Image src="/icons/underPointer.svg" width={12} height={12} alt="under_point" />
                  </div>
                </div>

                <div className="flex w-full flex-wrap justify-between gap-4 p-5">
                  <div className="w-[47.5%]">
                    <VenueCardInfo />
                  </div>
                  <div className="w-[47.5%]">
                    <VenueCardInfo />
                  </div>
                </div>
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </div>
    </div>
  );
}

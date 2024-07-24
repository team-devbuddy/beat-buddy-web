'use client';
import { Sheet } from 'react-modal-sheet';
import GoogleMap from '@/components/common/GoogleMap'; // 필요한 경우 경로 조정
import { useEffect, useState } from 'react';
import Image from 'next/image';
import VenueCardInfo from './component/VenueCardInfo';

export default function BottomSheetComponent() {
  const [height, setHeight] = useState<number>(500);
  const [isOpen, setOpen] = useState(false);

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
                    <div className="flex cursor-pointer gap-2 rounded-sm bg-gray700 px-[0.62rem] py-1">
                      <div className="text-gray300">장르</div>
                      <Image src="/icons/underPointer.svg" width={12} height={12} alt="under_point" />
                    </div>
                    <div className="flex cursor-pointer gap-2 rounded-sm bg-gray700 px-[0.62rem] py-1">
                      <div className="text-gray300">위치</div>
                      <Image src="/icons/underPointer.svg" width={12} height={12} alt="under_point" />
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

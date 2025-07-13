'use client';

import { EventDetail } from '@/lib/types';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { userProfileState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';
import { eventState } from '@/context/recoil-context';

import BoardDropDown from '../../Board/BoardDropDown';

export default function EventInfo({ eventDetail }: { eventDetail: EventDetail }) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const userProfile = useRecoilValue(userProfileState);
  const event = useRecoilValue(eventState);

  const onClick = () => {
    if (eventDetail.isAuthor) {
      router.push(`/event/${eventDetail.eventId}/participate-info`);
    } else {
      router.push(`/event/${eventDetail.eventId}/participate`);
    }
  };

  return (
    <div className="space-y-3 px-[1.25rem] py-[1.5rem]">
      <section>
        <h3 className="text-[1rem] font-bold text-white">Notice</h3>

        <div className="mt-3 flex flex-col gap-[0.5rem] rounded-md bg-gray700 p-4">
          <div className="flex items-center gap-[0.25rem]">
            <Image src="/icons/database.svg" alt="enter fee" width={20} height={20} />
            <p className="text-[0.8125rem] text-gray100">
              {eventDetail.ticketCost ? `입장료 ${eventDetail.ticketCost}` : '무료'}
            </p>
          </div>
          <div className="flex items-center gap-[0.25rem]">
            <Image src="/icons/alarm.svg" alt="info" width={20} height={20} />
            <p className="text-[0.8125rem] text-gray100">
              {eventDetail.notice ? `공지사항 ${eventDetail.notice}` : '공지사항이 없습니다'}
            </p>
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-[1rem] font-bold text-white">About</h3>
        <div className="mt-2 rounded-md bg-gray700 px-[1rem] py-[1.25rem] text-sm text-gray300">
          {eventDetail.content}
        </div>
      </section>
    </div>
  );
}

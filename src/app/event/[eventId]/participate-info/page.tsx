// app/participate-info/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ParticipateInfo from '@/components/units/Event/Participate/ParticipateInfo';
import { getParticipants } from '@/lib/actions/event-controller/participate-controller/getParticipate';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { useParams } from 'next/navigation';
import { Participant } from '@/lib/types';

export default function ParticipateInfoPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [participants, setParticipants] = useState<Participant[]>([]);
  console.log(participants);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getParticipants(eventId, accessToken); // accessToken 필요 시 함께 전달
      if (res) setParticipants(res);
    };
    fetchData();
  }, []);

  return <ParticipateInfo participants={participants} />;
}

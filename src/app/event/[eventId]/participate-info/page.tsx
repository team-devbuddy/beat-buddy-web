// app/participate-info/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ParticipateInfo from '@/components/units/Event/Participate/ParticipateInfo';
import { getParticipants } from '@/lib/actions/event-controller/participate-controller/getParticipate';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { useParams } from 'next/navigation';
import { Participant } from '@/lib/types';

interface ParticipantsData {
  eventId: number;
  totalMember: number;
  eventAttendanceExportDTOS: Participant[];
}

export default function ParticipateInfoPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [participants, setParticipants] = useState<ParticipantsData | undefined>(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getParticipants(eventId, accessToken); // accessToken 필요 시 함께 전달
      if (res) {
        // API 응답 구조에 맞게 데이터 변환
        const participantsData: ParticipantsData = {
          eventId: parseInt(eventId || '0'),
          totalMember: res.length || 0,
          eventAttendanceExportDTOS: res,
        };
        setParticipants(participantsData);
      }
    };
    fetchData();
  }, [eventId, accessToken]);

  return <ParticipateInfo participants={participants} />;
}

'use client';

import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Prev from '@/components/common/Prev';
import { useRouter } from 'next/navigation';

const dummyAlerts = [
  {
    id: 1,
    type: 'promotion',
    title: '이벤트 프로모션 어쩌구...',
    content: '여기에 프로모션 글을 열심히 적어요\n블라블라 이런저런 프로모션을 하고 있으니 참석하세요',
    time: '3분',
    read: false,
  },
  {
    id: 2,
    type: 'follow',
    title: '수빈버디님이 나를 팔로우했어요.',
    time: '30분',
    read: false,
  },
  {
    id: 3,
    type: 'like',
    title: '도현버디님 외 39명이 내 게시글을 좋아해요.',
    content: '오늘 만난 사람 선착순 10명',
    time: '30분',
    read: false,
  },
  {
    id: 4,
    type: 'scrap',
    title: '수현버디님이 내 게시글을 스크랩했어요.',
    content: '오늘 만난 사람 선착순 10명',
    time: '1일',
    read: false,
  },
  {
    id: 5,
    type: 'comment',
    title: '효진버디님이 내 게시글에 댓글을 남겼어요.',
    content: '나 1시 넘어서 가도 돼?',
    time: '1일',
    read: false,
  },
  {
    id: 6,
    type: 'reply',
    title: '효진버디님이 내 댓글에 대댓글을 남겼어요.',
    content: '지금 출발할게~~',
    time: '1일',
    read: false,
  },
  {
    id: 7,
    type: 'new_post',
    title: '규민버디가 새로운 글을 작성했어요.',
    content: '오늘 코딩할 사람 1명 구함',
    time: '30분',
    read: false,
  },
  {
    id: 8,
    type: 'event',
    title: 'RAPBEAT 2025 참석 1일 전이에요!',
    content: '참석 명단을 작성한 이벤트에요. or 좋아요 표시한 이벤트에요.',
    time: '30분',
    read: true,
  },
  {
    id: 9,
    type: 'inquiry',
    title: '새로운 문의 사항이 접수되었어요.',
    content: '문의 사항 내용을 적는다...',
    time: '1일',
    read: true,
  },
  {
    id: 10,
    type: 'answer',
    title: '내 문의에 답변이 작성되었어요.',
    content: '답변 내용을 적는다...',
    time: '1일',
    read: true,
  },
];

// 아이콘 매핑
const iconMap: Record<string, string> = {
  promotion: '/icons/Headers/Symbol.svg',
  follow: '/icons/Frame 2087327575.svg',
  like: '/icons/favorite-pink.svg',
  scrap: '/icons/material-symbols_bookmark.svg',
  comment: '/icons/maps_ugc-pink.svg',
  reply: '/icons/maps_ugc-pink.svg',
  new_post: '/icons/favorite-pink.svg',
  event: '/icons/favorite.svg',
  inquiry: '/icons/maps_ugc.svg',
  answer: '/icons/maps_ugc.svg',
};

export default function AlertList() {
  const router = useRouter();

    return (
        <div className="flex flex-col">
            <Prev url="/" onBack={() => router.back()} title="알림" />
    <div className="flex flex-col divide-y divide-gray500 border-t border-b border-gray500 bg-BG-black">
  {dummyAlerts.map((alert) => (
    <div
      key={alert.id}
      className="flex w-full items-start gap-[0.62rem] px-[1.25rem] py-[0.88rem]"
    >
      <Image src={iconMap[alert.type]} alt={alert.type} width={24} height={24} />
          <div className="flex-1">
              <div className="flex items-center justify-between">
        <div
          className={clsx(
            'text-[0.875rem] font-bold',
            alert.read ? 'text-gray200' : 'text-white'
          )}
        >
          {alert.title}
              </div>
              <div className="text-body3-12-medium text-gray200 whitespace-nowrap">{alert.time}</div>
</div>
{alert.content && (
  <div
    className={clsx(
      'text-[0.75rem] mt-[0.22rem]',
      alert.read ? 'text-gray200' : 'text-gray200'
    )}
  >
    {alert.content.split('\n').map((line, idx) => (
      <div key={idx}>{line}</div>
    ))}
  </div>
)}
      </div>
    </div>
  ))}
</div>
</div>
  );
}

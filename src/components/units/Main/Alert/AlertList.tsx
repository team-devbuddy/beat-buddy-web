'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import Prev from '@/components/common/Prev';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getNotifications, NotificationItem } from '@/lib/actions/notification-controller/getNotifications';
import { markNotificationRead } from '@/lib/actions/notification-controller/markNotificationRead';
import { formatNotificationTime } from '@/lib/utils/timeUtils';

// 알림 타입별 아이콘 매핑
const iconMap: Record<string, string> = {
  POST_COMMENT: '/icons/maps_ugc-pink.svg',
  POST_LIKE: '/icons/favorite-pink.svg',
  POST_SCRAP: '/icons/material-symbols_bookmark.svg',
  FOLLOW: '/icons/Frame 2087327575.svg',
  EVENT_REMINDER: '/icons/favorite.svg',
  PROMOTION: '/icons/Headers/Symbol.svg',
  NEW_POST: '/icons/favorite-pink.svg',
  INQUIRY: '/icons/maps_ugc.svg',
  ANSWER: '/icons/maps_ugc.svg',
  // 기본 아이콘
  default: '/icons/Headers/Symbol.svg',
};

// 알림 타입에 따른 페이지 라우팅 함수
const getNotificationRoute = (notification: NotificationItem): string => {
  const { type, postId, eventId, targetMemberId } = notification;

  switch (type) {
    case 'POST_COMMENT':
    case 'POST_LIKE':
    case 'POST_SCRAP':
      // 게시글 관련 알림 - 게시글 상세 페이지로 이동
      if (postId) {
        return `/board/detail/${postId}`;
      }
      return '/board';

    case 'FOLLOW':
      // 팔로우 알림 - 해당 사용자 프로필로 이동
      if (targetMemberId) {
        return `/mypage/profile/${targetMemberId}`;
      }
      return '/mypage/profile';

    case 'EVENT_REMINDER':
      // 이벤트 알림 - 이벤트 상세 페이지로 이동
      if (eventId) {
        return `/event/detail/${eventId}`;
      }
      return '/event';

    case 'PROMOTION':
      // 프로모션 알림 - 홈으로 이동
      return '/';

    case 'NEW_POST':
      // 새 게시글 알림 - 게시글 상세 페이지로 이동
      if (postId) {
        return `/board/detail/${postId}`;
      }
      return '/board';

    case 'INQUIRY':
    case 'ANSWER':
      // 문의/답변 - 마이페이지의 문의사항으로 이동
      return '/mypage';

    default:
      return '/';
  }
};

export default function AlertList() {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [clickedNotificationId, setClickedNotificationId] = useState<number | null>(null);

  const fetchNotifications = async (pageNum: number = 1, append: boolean = false) => {
    if (!accessToken) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getNotifications(accessToken, pageNum, 10);

      if (response.status === 200) {
        const newNotifications = response.data.content;

        if (append) {
          setNotifications((prev) => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
        }

        setHasMore(pageNum < response.data.totalPages);
      } else {
        setError('알림을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('알림 조회 실패:', err);
      setError('알림을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!accessToken) return;

    try {
      // 읽지 않은 알림인 경우에만 읽음 처리
      if (!notification.isRead) {
        // 클릭한 알림 ID 저장 (임시 배경색 적용용)
        setClickedNotificationId(notification.id);

        await markNotificationRead(accessToken, notification.id);

        // 로컬 상태 업데이트
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)),
        );

        // 1초 후 클릭 상태 해제
        setTimeout(() => {
          setClickedNotificationId(null);
        }, 1000);
      }

      // 해당 페이지로 이동
      const route = getNotificationRoute(notification);
      router.push(route);
    } catch (err) {
      console.error('알림 처리 실패:', err);
      // 읽음 처리 실패해도 페이지 이동은 진행
      const route = getNotificationRoute(notification);
      router.push(route);
      setClickedNotificationId(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [accessToken]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage, true);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex flex-col">
        <Prev url="/" onBack={() => router.back()} title="알림" />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray200">알림을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Prev url="/" onBack={() => router.back()} title="알림" />
        <div className="flex items-center justify-center py-20">
          <div className="text-main">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Prev url="/" onBack={() => router.back()} title="알림" />
      <div className="mt-[-0.4rem] flex flex-col divide-y divide-gray500 border-b border-t border-gray500 bg-BG-black">
        {notifications.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray200">알림이 없습니다.</div>
          </div>
        ) : (
          <>
            {notifications.map((notification, index) => (
              <div
                key={`${notification.id}-${index}`}
                className={clsx(
                  'flex w-full cursor-pointer items-start gap-[0.62rem] px-[1.25rem] py-[0.88rem] transition-colors',
                  clickedNotificationId === notification.id
                    ? 'bg-gray700'
                    : notification.isRead
                      ? 'hover:bg-gray600'
                      : 'hover:bg-gray700',
                )}
                onClick={() => handleNotificationClick(notification)}>
                <div className={clsx('flex h-6 w-6 items-center justify-center', notification.isRead && 'opacity-50')}>
                  <Image
                    src={iconMap[notification.type] || iconMap.default}
                    alt={notification.type}
                    width={24}
                    height={24}
                    className={clsx(notification.isRead && 'grayscale')}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div
                      className={clsx(
                        'text-[0.875rem] font-bold',
                        notification.isRead ? 'text-gray200' : 'text-white',
                      )}>
                      {notification.title}
                    </div>
                    <div className="whitespace-nowrap text-body3-12-medium text-gray200">
                      {formatNotificationTime(notification.createdAt)}
                    </div>
                  </div>
                  {notification.message && (
                    <div
                      className={clsx(
                        'mt-[0.22rem] text-[0.75rem]',
                        notification.isRead ? 'text-gray200' : 'text-gray200',
                      )}>
                      {notification.message.split('\n').map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
                {!notification.isRead && <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-main"></div>}
              </div>
            ))}

            {hasMore && (
              <div className="flex items-center justify-center py-4">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="rounded-md bg-gray600 px-4 py-2 text-[0.875rem] text-white hover:bg-gray500 disabled:opacity-50">
                  {loading ? '로딩 중...' : '더보기'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

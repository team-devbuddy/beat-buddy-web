'use client';

import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { EventDetail } from '@/lib/types';
import EventCommentItem from './EventCommentItem';
import { getAllQnA } from '@/lib/actions/event-controller/getAllQnA';
import Image from 'next/image';

interface CommentType {
  commentId: number;
  commentLevel: number;
  content: string;
  authorNickname: string;
  anonymous: boolean;
  createdAt: string;
  isAuthor: boolean;
  isFollowing: boolean;
  writerId: number;
  isStaff: boolean;
  isBlockedMember: boolean;
  replies?: CommentType[];
}

interface EventQnAProps {
  eventDetail: EventDetail;
  observerRef: React.RefObject<HTMLDivElement>;
}

export default function EventQnA({ eventDetail, observerRef }: EventQnAProps) {
  const accessToken = useRecoilValue(accessTokenState) || '';

  const [comments, setComments] = useState<CommentType[]>([]);
  const [scrollTargetId, setScrollTargetId] = useState<number | null>(null);

  const fetchComments = async (scrollToReplyId?: number) => {
    try {
      const res = await getAllQnA(eventDetail.eventId, accessToken);
      const filtered = res.filter((comment: CommentType) => !comment.isBlockedMember);
      filtered.sort(
        (a: CommentType, b: CommentType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setComments(filtered);

      if (scrollToReplyId) {
        setScrollTargetId(scrollToReplyId);
      }
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    if (scrollTargetId) {
      const el = document.getElementById(`reply-${scrollTargetId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setScrollTargetId(null);
      }
    }
  }, [comments]);

  useEffect(() => {
    fetchComments();
  }, [eventDetail.eventId, accessToken]);

  return (
    <div className="px-5 pt-[0.88rem]">
      {comments.length > 0 ? (
        comments.map((comment) =>
          comment ? (
            <div key={comment.commentId} className="">
              <EventCommentItem comment={comment} eventId={eventDetail.eventId} refreshComments={fetchComments} />
            </div>
          ) : null,
        )
      ) : (
        <div className="flex min-h-[calc(100vh-395px)] flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Image src="/icons/blackLogo.svg" alt="no result" width={50.03} height={46.9} />
            <span className="text-body-14-bold mt-2 text-center text-gray300">아직 등록된 문의가 없어요</span>
            <span className="text-body-11-medium text-gray400">궁금한 점을 남겨주세요!</span>
          </div>
        </div>
      )}
      <div ref={observerRef} />
    </div>
  );
}

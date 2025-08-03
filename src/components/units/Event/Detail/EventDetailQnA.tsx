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
    <div className="px-5 pb-24 pt-2">
      {comments.length > 0 ? (
        comments.map((comment) =>
          comment ? (
            <div key={comment.commentId} className="">
              <EventCommentItem comment={comment} eventId={eventDetail.eventId} refreshComments={fetchComments} />
            </div>
          ) : null,
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-[3rem]">
          <Image src="/icons/blackLogo.svg" alt="no result" width={80} height={80} />
          <div className="mt-3 text-center text-[0.875rem] text-gray300">
            아직 문의가 없어요
            <br />첫 번째 문의를 남겨보세요!
          </div>
        </div>
      )}
      <div ref={observerRef} />
    </div>
  );
}

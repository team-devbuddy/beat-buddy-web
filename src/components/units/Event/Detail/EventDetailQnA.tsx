'use client';

import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { EventDetail } from '@/lib/types';
import EventCommentItem from './EventCommentItem';
import { getAllQnA } from '@/lib/actions/event-controller/getAllQnA';
import { postComment } from '@/lib/actions/event-controller/postComment';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

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
  replies?: CommentType[];
  eventId: number;
}

export default function EventQnA({ eventDetail }: { eventDetail: EventDetail }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [qnaContent, setQnaContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await getAllQnA(eventDetail.eventId, accessToken);
      setComments(res);
    } catch (err) {
      console.error('댓글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventDetail.eventId, accessToken]);

  const handleSubmit = async () => {
    if (!qnaContent.trim()) return;
    setIsSubmitting(true);
    try {
      await postComment(eventDetail.eventId, {
        content: qnaContent,
        anonymous: true, // 필요 시 false로 변경
        parentCommentId: '', // 최상위 댓글은 빈 문자열로
      }, accessToken);

      setQnaContent('');
      setShowModal(false);
      fetchComments(); // 작성 후 목록 갱신
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="px-5 py-2">
        {comments.map((comment) => (
          <EventCommentItem key={comment.commentId} comment={comment} eventId={eventDetail.eventId} />
        ))}
        <div ref={observerRef} />
      </div>

      {/* 🟣 플로팅 버튼 */}
      <div className="fixed bottom-6 right-4 z-50">
        <button
          title="문의하기"
          onClick={() => setShowModal(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-main2 bg-sub2 text-white shadow-lg transition-transform duration-150 ease-in-out active:scale-90"
        >
          <Image src="/icons/ic_baseline-plus.svg" alt="글쓰기" width={28} height={28} />
        </button>
      </div>

      {/* ✅ QnA 작성 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setShowModal(false)}
          >
            <div
              className="rounded-lg bg-BG-black px-5 pb-6 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-[1.25rem] font-bold text-white">문의하기</h3>
              <textarea
                value={qnaContent}
                onChange={(e) => setQnaContent(e.target.value)}
                placeholder="문의 내용을 작성해 주세요"
                className="mb-4 min-h-[7.5rem] w-full min-w-[18rem] resize-none rounded-[0.5rem] bg-gray700 px-4 py-3 text-sm text-gray200 placeholder:text-gray300 focus:outline-none"
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] font-bold text-gray200"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] font-bold text-main"
                >
                  {isSubmitting ? '등록 중...' : '등록하기'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

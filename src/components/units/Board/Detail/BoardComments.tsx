'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import BoardReply, { ReplyType } from './BoardReply';
import { getAllComments } from '@/lib/actions/comment-controller/getAllComments';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, scrollToCommentState } from '@/context/recoil-context';
import { motion, AnimatePresence } from 'framer-motion';

export interface CommentType {
  id: number;
  content: string;
  isAnonymous: boolean;
  replyId: number | null;
  memberName: string;
  likes: number;
  liked?: boolean; // 현재 사용자가 좋아요를 눌렀는지 여부 (optional)
  createdAt: string;
  isAuthor: boolean;
  userId: string;
  isBlocked?: boolean; // 차단된 사용자인지 여부
}

interface Props {
  postId: number;
  comments: CommentType[];
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
  bottomRef: React.RefObject<HTMLDivElement>;
}

export default function BoardComments({ postId, comments, setComments, bottomRef }: Props) {
  // ✅ 1. page 상태 초기값을 0으로 변경하여 첫 페이지 로드를 명시적으로 관리합니다.
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const size = 10;
  const [scrollToComment, setScrollToComment] = useRecoilState(scrollToCommentState);
  // ✅ 초기 로드가 한 번만 실행되도록 ref로 상태를 관리합니다.
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (scrollToComment === null) return;

    if (scrollToComment === 'bottom') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // ID를 이용해 특정 댓글 DOM 요소를 찾음
      const targetElement = document.getElementById(`comment-${scrollToComment}`);
      targetElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // ✅ 명령 실행 후 상태를 다시 null로 초기화
    setScrollToComment(null);
  }, [scrollToComment, comments, bottomRef, setScrollToComment]); // comments가 업데이트 된 후 실행되도록 의존성 추가

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLastPage || !node) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      observer.observe(node);
      return () => observer.disconnect();
    },
    [isLoading, isLastPage],
  );

  // ✅ 2. useEffect를 하나로 통합하여 데이터 로딩 로직을 일원화합니다.
  useEffect(() => {
    // accessToken이 없으면 API를 호출하지 않습니다.
    if (!accessToken) return;

    // 초기 로드(page: 0)가 이미 실행되었다면, 다시 실행하지 않습니다.
    if (page === 0 && initialLoadRef.current) return;

    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const res = await getAllComments(postId, page, size, accessToken);

        if (res.content) {
          // page 값에 따라 상태를 덮어쓰거나 추가하도록 분기합니다.
          if (page === 0) {
            // 초기 로드: 댓글 목록을 완전히 새로 설정합니다.
            setComments(
              res.content.sort(
                (a: CommentType, b: CommentType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
              ),
            );
            initialLoadRef.current = true; // 초기 로드 완료!
          } else {
            // 무한 스크롤: 기존 목록에 새 댓글을 추가합니다.
            setComments((prev) => {
              // 중복을 방지하기 위해 Set을 사용하여 ID를 기준으로 유니크한 댓글만 합칩니다.
              const existingIds = new Set(prev.map((c) => c.id));
              const newComments = res.content.filter((c: CommentType) => !existingIds.has(c.id));
              return [...prev, ...newComments].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
              );
            });
          }
          setIsLastPage(res.last);
        }
      } catch (error) {
        console.error('댓글 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [page, postId, accessToken, setComments]);

  const parentComments = comments.filter((c) => c.replyId === null && !c.isBlocked);

  return (
    <div className="bg-transparent pb-[3rem] pt-5">
      <AnimatePresence>
        {parentComments.map((comment) => (
          <motion.div
            id={`comment-${comment.id}`}
            key={comment.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}>
            <BoardReply reply={comment} allComments={comments} setComments={setComments} postId={postId} />
          </motion.div>
        ))}
      </AnimatePresence>
      {!isLoading && !isLastPage && <div ref={loadMoreRef} style={{ height: '1px' }} />}
      <div ref={bottomRef} style={{ height: '1px' }} />
    </div>
  );
}

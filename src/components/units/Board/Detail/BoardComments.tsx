'use client';

import { useEffect, useRef, useState } from 'react';
import BoardReply from './BoardReply';
import { getAllComments } from '@/lib/actions/comment-controller/getAllComments';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface CommentType {
  id: number;
  content: string;
  isAnonymous: boolean;
  replyId: number | null;
  memberName: string;
  likes: number;
  createdAt: string;
  isAuthor: boolean;
  userId: string;
}

interface Props {
  postId: number;
}

export default function BoardComments({ postId }: Props) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const size = 10; // 페이지당 댓글 수

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getAllComments(postId, page, size, accessToken);
        setComments((prev) => [...prev, ...res.content]);
        setIsLastPage(res.last);
      } catch (err) {
        console.error('댓글 불러오기 실패:', err);
      }
    };
    if (!isLastPage) fetchComments();
  }, [page, postId, accessToken]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLastPage) {
        setPage((prev) => prev + 1);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isLastPage]);

  return (
    <div className="pb-[6.5rem] bg-transparent">
      {comments.map((comment) => (
        <BoardReply key={comment.id} reply={comment} />
      ))}
      <div ref={observerRef} className="" />
    </div>
  );
}

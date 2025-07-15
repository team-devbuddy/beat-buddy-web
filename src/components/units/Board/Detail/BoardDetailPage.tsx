'use client';

import { useEffect, useState, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, followMapState, replyingToState } from '@/context/recoil-context'; // ✅ replyingToState import
import { getPostDetail } from '@/lib/actions/detail-controller/board/boardWriteUtils';
import BoardDetail from '@/components/units/Board/Detail/BoardDetail';
import NoResults from '@/components/units/Search/NoResult';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BoardComments from './BoardComments';
import BoardCommentInput from './BoardCommentInput';
import { CommentType } from './BoardComments';

interface PostType {
  id: number;
  profileImageUrl: string;
  role: string;
  title: string;
  content: string;
  nickname: string;
  createAt: string;
  likes: number;
  scraps: number;
  comments: number;
  hashtags: string[];
  writerId: number;
  liked: boolean;
  hasCommented: boolean;
  scrapped: boolean;
  isAuthor: boolean;
  views: number;
  imageUrls?: string[];
  isFollowing: boolean;
}

export default function BoardDetailPage({ postId, category }: { postId: number; category: string }) {
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ 1. 답글 상태와 댓글 입력창의 ref를 가져옵니다.
  const [replyingTo, setReplyingTo] = useRecoilState(replyingToState);
  const commentInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || isNaN(postId)) return setPost(null);
      try {
        const fetchedPost = await getPostDetail(category, postId, accessToken);
        setPost(fetchedPost);
      } catch {
        setPost(null);
      }
    };
    fetchPost();
  }, [postId, category]);

  useEffect(() => {
    if (post) setFollowMap((prev) => ({ ...prev, [post.writerId]: post.isFollowing }));
  }, [post, setFollowMap]);


  // ✅ 2. 답글 모드일 때 외부 클릭을 감지하는 useEffect를 추가합니다.
  useEffect(() => {
    // 답글 모드가 아니면 리스너를 추가하지 않습니다.
    if (!replyingTo) return;

    const handleClickOutside = (event: MouseEvent) => {
      // 안전 영역 1: 하단 댓글 입력창
      const isClickInInput = commentInputRef.current?.contains(event.target as Node);
      
      // 안전 영역 2: 하이라이트된 부모 댓글
      const parentCommentElement = document.getElementById(`comment-${replyingTo.parentId}`);
      const isClickInParentComment = parentCommentElement?.contains(event.target as Node);
      
      // 두 안전 영역 바깥을 클릭했을 때만 답글 모드를 취소합니다.
      if (!isClickInInput && !isClickInParentComment) {
        setReplyingTo(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [replyingTo, setReplyingTo]);


  return (
    <main className="relative min-h-screen bg-BG-black pb-[5.5rem] text-white">
      <div className="flex items-center justify-between py-4 pl-[0.62rem] pr-4">
        <Image
          onClick={() => router.back()}
          src="/icons/line-md_chevron-left.svg"
          alt="뒤로가기"
          width={35}
          height={35}
          className="cursor-pointer"
        />
      </div>

      {post ? <BoardDetail postId={post.id} post={post} /> : <NoResults />}
      {post && <BoardComments postId={post.id} comments={comments} setComments={setComments} bottomRef={bottomRef} />}

      {post && (
        // ✅ 3. 댓글 입력창을 div로 감싸고 ref를 연결합니다.
        <div ref={commentInputRef} className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 py-4">
          <BoardCommentInput
            postId={post.id}
            onCommentAdded={(newComment) => {
              setComments((prev) => [...prev, newComment]);
            }}
          />
        </div>
      )}
    </main>
  );
}
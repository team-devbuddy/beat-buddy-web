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
  thumbImage?: string[];
  isAnonymous: boolean;
}

export default function BoardDetailPage({ postId, category }: { postId: number; category: string }) {
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isLoadingPost = useRef(false); // API 호출 중복 방지

  // ✅ 1. 답글 상태와 댓글 입력창의 ref를 가져옵니다.
  const [replyingTo, setReplyingTo] = useRecoilState(replyingToState);
  const commentInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || isNaN(postId)) {
        console.log('❌ fetchPost: 잘못된 postId', { postId });
        setLoading(false);
        return setPost(null);
      }

      if (!accessToken) {
        console.log('⏳ fetchPost: accessToken 없음, 대기 중...');
        return;
      }

      // 이미 로딩 중이면 중복 호출 방지
      if (isLoadingPost.current) {
        console.log('⚠️ fetchPost: 이미 로딩 중, 중복 호출 방지');
        return;
      }

      isLoadingPost.current = true;
      setLoading(true);
      console.log('🔄 fetchPost 시작:', { postId, category, accessToken: !!accessToken });

      try {
        const fetchedPost = await getPostDetail(category, postId, accessToken);
        console.log('✅ fetchPost 성공:', fetchedPost);
        setPost(fetchedPost);
      } catch (error) {
        console.error('❌ fetchPost 실패:', {
          error,
          postId,
          category,
          accessToken: !!accessToken,
          errorMessage: error instanceof Error ? error.message : '알 수 없는 에러',
        });
        setPost(null);
      } finally {
        isLoadingPost.current = false;
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, category, accessToken]); // accessToken을 의존성에 추가

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

      {loading ? (
        <div className="flex h-full items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : post ? (
        <BoardDetail postId={post.id} post={post} />
      ) : (
        <NoResults text="아직 게시글이 없어요." />
      )}
      {post && <BoardComments postId={post.id} comments={comments} setComments={setComments} bottomRef={bottomRef} />}

      {post && (
        // ✅ 3. 댓글 입력창을 div로 감싸고 ref를 연결합니다.
        <div ref={commentInputRef} className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 py-4">
          <BoardCommentInput
            postId={post.id}
            onCommentAdded={(newComment) => {
              setComments((prev) => [...prev, { ...newComment, liked: false }]);
            }}
          />
        </div>
      )}
    </main>
  );
}

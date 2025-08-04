'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '../BoardThread';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { accessTokenState, userProfileState, replyingToState, commentInputFocusState } from '@/context/recoil-context';
import { deleteComment } from '@/lib/actions/comment-controller/deleteComment';
import BoardDropDown from '../BoardDropDown';
import { CommentType } from './BoardComments';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { addReplyLike } from '@/lib/actions/post-interaction-controller/addReplyLike';
import { deleteReplyLike } from '@/lib/actions/post-interaction-controller/deleteReplyLike';
import { replyLikeState, replyLikeCountState } from '@/context/recoil-context';

export type { CommentType as ReplyType };

interface Props {
  postId: number;
  reply: CommentType;
  allComments: CommentType[];
  isNested?: boolean;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}

export default function BoardReply({ postId, reply, allComments, isNested = false, setComments }: Props) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const [showMenu, setShowMenu] = useState(false);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  // 컴포넌트 마운트 시 데이터 확인

  const [replyingTo, setReplyingTo] = useRecoilState(replyingToState);
  const setFocusTrigger = useSetRecoilState(commentInputFocusState);
  const [replyLike, setReplyLike] = useRecoilState(replyLikeState);
  const [replyLikeCount, setReplyLikeCount] = useRecoilState(replyLikeCountState);
  const isReplying = replyingTo?.parentId === reply.id;

  // 현재 댓글의 좋아요 상태와 개수 (persist 우선, 서버 데이터 fallback)
  const isLiked = replyLike[reply.id] !== undefined ? replyLike[reply.id] : reply.liked ?? false;
  const likeCount = replyLikeCount[reply.id] !== undefined ? replyLikeCount[reply.id] : reply.likes;

  // 댓글 좋아요 상태 초기화 (persist 데이터가 없을 때만)
  useEffect(() => {
    if (replyLike[reply.id] === undefined) {
      setReplyLike((prev) => ({ ...prev, [reply.id]: reply.liked ?? false }));
    }
    if (replyLikeCount[reply.id] === undefined) {
      setReplyLikeCount((prev) => ({ ...prev, [reply.id]: reply.likes }));
    }
  }, [reply.id, reply.liked, reply.likes]);

  const handleReplyClick = () => {
    if (isReplying) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ parentId: reply.id, parentName: reply.memberName });
      setFocusTrigger((c) => c + 1);
    }
  };

  const handleLike = async () => {
    if (!accessToken || isLoadingLike) return;

    // 현재 상태 저장 (에러 시 롤백용)
    const previousLiked = isLiked;
    const previousCount = likeCount;

    try {
      setIsLoadingLike(true);

      // UI 즉시 업데이트 (Optimistic Update)
      setReplyLike((prev) => ({ ...prev, [reply.id]: !previousLiked }));
      setReplyLikeCount((prev) => ({
        ...prev,
        [reply.id]: previousLiked ? previousCount - 1 : previousCount + 1,
      }));

      // 현재 좋아요 상태에 따라 API 호출
      let response;
      if (previousLiked) {
        // 이미 좋아요를 눌렀다면 DELETE로 삭제
        response = await deleteReplyLike(postId, reply.id, accessToken);
      } else {
        // 좋아요를 안 눌렀다면 PUT으로 추가
        response = await addReplyLike(postId, reply.id, accessToken);
      }

      // 서버 응답이 있다면 정확한 상태로 업데이트
      if (response && response.data) {
        // 서버에서 정확한 liked 값이 오면 사용, 없으면 예상값 유지
        if (typeof response.data.liked === 'boolean') {
          setReplyLike((prev) => ({ ...prev, [reply.id]: response.data.liked }));
        } else {
          console.log(`⚠️ 서버 응답에 liked 필드 없음, 예상값 유지: ${previousLiked}`);
        }

        // 서버에서 정확한 likes 값이 오면 사용, 없으면 예상값 유지
        if (typeof response.data.likes === 'number') {
          console.log(`✅ 서버에서 likes 업데이트: ${response.data.likes}`);
          setReplyLikeCount((prev) => ({ ...prev, [reply.id]: response.data.likes }));
        } else {
          console.log(
            `⚠️ 서버 응답에 likes 필드 없음, 예상값 유지: ${previousLiked ? previousCount - 1 : previousCount + 1}`,
          );
        }
      } else {
        console.log('⚠️ 서버 응답 없음 또는 data 필드 없음, 예상값 유지');
      }
    } catch (error) {
      console.error('댓글 좋아요 처리 실패:', error);

      // 에러 시 상태 롤백
      setReplyLike((prev) => ({ ...prev, [reply.id]: previousLiked }));
      setReplyLikeCount((prev) => ({ ...prev, [reply.id]: previousCount }));

      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      await deleteComment(postId, reply.id, accessToken);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== reply.id));
    } catch (error) {
      console.error('댓글 삭제 실패', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  }, [postId, reply.id, accessToken, setComments]);

  const handleMenuClick = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const left = Math.max(10, rect.left - 80);
      const top = rect.bottom + window.scrollY + 4;
      setDropdownPosition({ top, left });
    }
    setShowMenu(true);
  };

  const handleProfileClick = () => {
    // 익명 댓글인 경우 프로필로 이동하지 않음
    if (reply.isAnonymous) return;

    if (reply.userId) {
      router.push(`/board/profile?writerId=${reply.userId}`);
    }
  };

  const formattedTime = formatRelativeTime(reply.createdAt);
  const childReplies = allComments.filter((c) => c.replyId === reply.id && !c.isBlocked); // 차단된 사용자 제외

  // 차단된 사용자의 댓글은 렌더링하지 않음
  if (reply.isBlocked) {
    return null;
  }

  // ✅ isNested prop에 따라 다른 UI 구조를 반환하도록 수정
  if (isNested) {
    // 자식 댓글(대댓글) UI
    return (
      <div id={`comment-${reply.id}`} className="w-full">
        {/* ✅ 스크린샷 디자인에 맞춰 회색 배경과 패딩을 적용합니다. */}
        <div
          className={classNames('flex w-full flex-col gap-[0.5rem] rounded-lg transition-colors', {
            'bg-gray800': isReplying,
          })}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.37rem] text-[0.8125rem] font-bold text-white">
              <Image
                src={
                  reply.isAnonymous
                    ? '/icons/default-profile.svg'
                    : reply.profileImageUrl || '/icons/default-profile.svg'
                }
                alt="profile"
                width={22}
                height={22}
                className="h-[22px] w-[22px] cursor-pointer rounded-full object-cover"
                onClick={handleProfileClick}
              />
              {reply.memberName}
              <span className="text-[0.75rem] text-gray200">· {formattedTime}</span>
            </div>
            <div className="relative">
              <Image
                ref={iconRef}
                src="/icons/dot-vertical.svg"
                alt="menu"
                width={20}
                height={20}
                onClick={handleMenuClick}
                className="cursor-pointer"
              />
            </div>
          </div>
          <p className="whitespace-pre-wrap text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
          <div className="flex items-center gap-4 text-[0.75rem] text-gray300">
            <button
              onClick={handleLike}
              disabled={isLoadingLike}
              className={`flex items-center gap-[0.19rem] disabled:opacity-50 ${
                isLiked ? 'text-main' : 'text-gray300'
              }`}>
              <Image
                src={isLiked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
                alt="heart"
                width={16}
                height={16}
              />
              {likeCount}
            </button>
          </div>
        </div>
        {showMenu && (
          <BoardDropDown
            isAuthor={reply.isAuthor}
            onClose={() => setShowMenu(false)}
            position={dropdownPosition}
            postId={postId}
            commentId={reply.id}
            type="comment"
            commentAuthorName={reply.memberName}
            onCommentDelete={() =>
              setComments((prevComments) => prevComments.filter((comment) => comment.id !== reply.id))
            }
            writerId={reply.userId ? parseInt(reply.userId) : undefined}
          />
        )}
      </div>
    );
  }

  // 부모 댓글(최상위 댓글) UI
  return (
    <div id={`comment-${reply.id}`} className="flex flex-col gap-3 px-5 pb-5">
      <div
        className={classNames('-m-3 flex flex-col gap-[0.5rem] rounded-lg p-3 transition-colors', {
          '': isReplying,
        })}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.37rem] text-[0.75rem] font-bold text-white">
            <Image
              src={
                reply.isAnonymous ? '/icons/default-profile.svg' : reply.profileImageUrl || '/icons/default-profile.svg'
              }
              alt="profile"
              width={22}
              height={22}
              className="h-[22px] w-[22px] cursor-pointer rounded-full object-cover safari-icon-fix"
              onClick={handleProfileClick}
            />
            {reply.memberName}
            <span className="text-body3-12-medium text-gray200">· {formattedTime}</span>
          </div>
          <div className="relative">
            <Image
              ref={iconRef}
              src="/icons/dot-vertical.svg"
              alt="menu"
              width={20}
              height={20}
              onClick={handleMenuClick}
              className="cursor-pointer"
            />
          </div>
        </div>
        <p className="whitespace-pre-wrap text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
        <div className="flex items-center gap-4 text-[0.75rem] text-gray300">
          <button
            onClick={handleLike}
            disabled={isLoadingLike}
            className={`flex items-center gap-[0.19rem] disabled:opacity-50 ${isLiked ? 'text-main' : 'text-gray300'}`}>
            <Image
              src={isLiked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
              alt="heart"
              width={16}
              height={16}
            />
            {likeCount}
          </button>
          <button onClick={handleReplyClick} className="text-gray300">
            {isReplying ? '답글 취소' : '답글 달기'}
          </button>
        </div>
      </div>

      {/* ✅ 자식 댓글 목록 렌더링 부분 수정 */}
      {childReplies.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
          {/* ✅ 자식 목록을 AnimatePresence로 감싸줍니다. */}
          <AnimatePresence>
            {childReplies.map((child) => (
              // ✅ 각 자식 요소를 motion.div로 감싸고 애니메이션 속성을 부여합니다.
              <motion.div
                key={child.id}
                layout
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2">
                <Image src="/icons/replyArrow.svg" alt="reply arrow" width={16} height={16} className="mt-1" />
                <BoardReply
                  reply={child}
                  allComments={allComments}
                  isNested
                  setComments={setComments}
                  postId={postId}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showMenu && (
        <BoardDropDown
          isAuthor={reply.isAuthor}
          onClose={() => setShowMenu(false)}
          position={dropdownPosition}
          postId={postId}
          commentId={reply.id}
          type="comment"
          commentAuthorName={reply.memberName}
          onCommentDelete={() =>
            setComments((prevComments) => prevComments.filter((comment) => comment.id !== reply.id))
          }
          writerId={reply.userId ? parseInt(reply.userId) : undefined}
        />
      )}
    </div>
  );
}

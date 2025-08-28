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
  onCommentDeleted?: (commentId: number) => void; // 댓글 삭제 콜백 추가
}

// 탈퇴한 사용자 처리를 위한 유틸리티 함수
const getDisplayName = (memberName: string, isWithdrawn?: boolean, isAnonymous?: boolean) => {
  if (isAnonymous) return '익명';
  if (isWithdrawn) return '(알 수 없음)';
  return memberName;
};

const getDisplayImage = (imageUrl?: string, isWithdrawn?: boolean, isAnonymous?: boolean) => {
  if (isAnonymous || isWithdrawn) return '/icons/default-profile.svg';
  return imageUrl || '/icons/default-profile.svg';
};

const getDisplayStyle = (isWithdrawn?: boolean) => {
  if (isWithdrawn) return 'text-gray200';
  return 'text-white';
};

export default function BoardReply({
  postId,
  reply,
  allComments,
  isNested = false,
  setComments,
  onCommentDeleted,
}: Props) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const [showMenu, setShowMenu] = useState(false);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isLoadingLike, setIsLoadingLike] = useState(false);

  // onCommentDeleted prop 디버깅
  console.log('🔥 BoardReply props 확인:', {
    replyId: reply.id,
    onCommentDeleted: !!onCommentDeleted,
    onCommentDeletedType: typeof onCommentDeleted,
  });

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
    // 삭제된 댓글에는 답글 달기 불가
    if (reply.isDeleted) return;

    if (isReplying) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ parentId: reply.id, parentName: reply.memberName });
      setFocusTrigger((c) => c + 1);
    }
  };
  const renderBlockedComment = (isNestedComment: boolean = false) => {
    const containerClass = isNestedComment ? 'flex w-full flex-col gap-2 rounded-lg' : 'flex flex-col gap-2 rounded-lg';

    return (
      <div className={containerClass}>
        <div className="flex items-center gap-1 pb-[0.88rem] text-body-13-medium text-gray300">
          <Image src="/icons/block.svg" alt="profile" width={20} height={20} className="rounded-full object-cover" />
          <p className="whitespace-pre-wrap text-body-13-medium text-gray300">차단한 사용자의 댓글입니다.</p>
        </div>
      </div>
    );
  };

  const handleLike = async () => {
    // 삭제된 댓글에는 좋아요 불가
    if (reply.isDeleted || !accessToken || isLoadingLike) return;

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

      alert('좋아요 처리에 실패했습니다. 다시 시도해주세요');
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleDelete = useCallback(async () => {
    // 낙관적 업데이트: 즉시 UI에서 댓글 제거
    console.log('🔥 댓글 삭제 시작 (낙관적 업데이트):', { commentId: reply.id, postId });
    console.log('🔥 onCommentDeleted prop 상태:', {
      exists: !!onCommentDeleted,
      type: typeof onCommentDeleted,
      isFunction: typeof onCommentDeleted === 'function',
    });

    // 즉시 부모 컴포넌트에 댓글 삭제 알림 (낙관적 업데이트)
    if (onCommentDeleted && typeof onCommentDeleted === 'function') {
      console.log('🔥 onCommentDeleted 콜백 즉시 호출 (낙관적):', reply.id);
      try {
        onCommentDeleted(reply.id);
        console.log('🔥 onCommentDeleted 콜백 실행 완료');
      } catch (error) {
        console.error('🔥 onCommentDeleted 콜백 실행 실패:', error);
      }
    } else {
      console.log('🔥 onCommentDeleted 콜백이 없거나 함수가 아님:', onCommentDeleted);
    }

    // 즉시 BoardDetail 상태 업데이트 (낙관적 업데이트)
    if ((window as any).commentHandlers && (window as any).commentHandlers[postId]) {
      console.log('🔥 BoardDetail 상태 즉시 업데이트 (낙관적)');
      (window as any).commentHandlers[postId].deleteComment();
    }

    // 즉시 로컬 상태 업데이트 (낙관적 업데이트)
    const childReplies = allComments.filter((c) => c.replyId === reply.id && !c.isBlocked);
    if (childReplies.length > 0) {
      // 자식댓글이 있으면 삭제된 상태로 표시
      setComments((prevComments) =>
        prevComments.map((comment) => (comment.id === reply.id ? { ...comment, isDeleted: true } : comment)),
      );
    } else {
      // 자식댓글이 없으면 완전 삭제
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== reply.id));
    }

    // API 호출은 백그라운드에서 실행 (성공/실패와 관계없이 UI는 이미 업데이트됨)
    try {
      await deleteComment(postId, reply.id, accessToken);
      console.log('🔥 댓글 삭제 API 성공');
    } catch (error) {
      console.error('🔥 댓글 삭제 API 실패 (하지만 UI는 이미 업데이트됨):', error);
      // API 실패해도 UI는 이미 업데이트되어 있으므로 롤백하지 않음
      // 사용자가 다시 시도할 수 있도록 안내
      console.log('🔥 API 실패했지만 UI는 이미 업데이트되어 있음');
    }
  }, [postId, reply.id, accessToken, setComments, allComments, onCommentDeleted]);

  const handleMenuClick = () => {
    // 삭제된 댓글에는 드롭다운 메뉴 불가
    if (reply.isDeleted) return;

    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const left = Math.max(10, rect.left - 80);
      const top = rect.bottom + window.scrollY + 4;
      setDropdownPosition({ top, left });
    }
    setShowMenu(true);
  };

  const handleProfileClick = () => {
    // 삭제된 댓글이나 익명 댓글인 경우 프로필로 이동하지 않음
    if (reply.isDeleted || reply.isAnonymous) {
      console.log('프로필 클릭 차단:', { isDeleted: reply.isDeleted, isAnonymous: reply.isAnonymous });
      return;
    }

    console.log('프로필 클릭 시도:', {
      writerId: reply.writerId,
      memberName: reply.memberName,
      isAnonymous: reply.isAnonymous,
      isDeleted: reply.isDeleted,
    });

    if (reply.writerId) {
      console.log('프로필 페이지로 이동:', `/board/profile?writerId=${reply.writerId}`);
      router.push(`/board/profile?writerId=${reply.writerId}`);
    } else {
      console.log('writerId가 없어서 프로필 이동 불가');
    }
  };

  const formattedTime = formatRelativeTime(reply.createdAt);
  const childReplies = allComments.filter((c) => c.replyId === reply.id); // 차단된 사용자도 포함

  // 디버깅용 로그
  console.log('BoardReply 렌더링:', {
    replyId: reply.id,
    isBlocked: reply.isBlocked,
    isDeleted: reply.isDeleted,
    memberName: reply.memberName,
    childRepliesCount: childReplies.length,
  });

  // 삭제된 댓글에 자식댓글이 없으면 렌더링하지 않음
  if (reply.isDeleted && childReplies.length === 0) {
    return null;
  }

  // 삭제된 댓글 렌더링 함수
  const renderDeletedComment = (isNestedComment: boolean = false) => {
    const containerClass = isNestedComment ? 'flex w-full flex-col gap-2' : 'flex flex-col gap-2';

    return (
      <div className={containerClass}>
        <div className="flex items-center gap-1 pb-[0.88rem] pt-[0.62rem] text-body-13-medium text-gray300">
          <Image
            src="/icons/cancel.svg"
            alt="profile"
            width={20}
            height={20}
            className="h-[20px] w-[20px] rounded-full object-cover"
          />
          <p className="whitespace-pre-wrap text-body-13-medium text-gray300">삭제된 댓글입니다.</p>
        </div>
      </div>
    );
  };

  // ✅ isNested prop에 따라 다른 UI 구조를 반환하도록 수정
  if (isNested) {
    // 자식 댓글(대댓글) UI
    return (
      <div id={`comment-${reply.id}`} className="w-full">
        {/* ✅ 스크린샷 디자인에 맞춰 회색 배경과 패딩을 적용합니다. */}
        <div
          className={classNames('flex w-full flex-col gap-1', {
            'mt-1': reply.isBlocked,
            'bg-gray800': isReplying,
          })}>
          {reply.isBlocked ? (
            renderBlockedComment(true)
          ) : reply.isDeleted ? (
            renderDeletedComment(true)
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-[0.37rem] text-body-13-medium text-white">
                  <Image
                    src={getDisplayImage(reply.imageUrl, reply.isWithdrawn, reply.isAnonymous)}
                    alt="profile"
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] cursor-pointer rounded-full object-cover"
                    onClick={handleProfileClick}
                  />
                  {reply.isPostWriter && (
                    <span className={`font-bold text-main ${getDisplayStyle(reply.isWithdrawn)}`}>
                      {getDisplayName(reply.memberName, reply.isWithdrawn, reply.isAnonymous)}(작성자)
                    </span>
                  )}
                  {!reply.isPostWriter && (
                    <span className={`text-body-13-medium font-bold ${getDisplayStyle(reply.isWithdrawn)}`}>
                      {getDisplayName(reply.memberName, reply.isWithdrawn, reply.isAnonymous)}
                    </span>
                  )}
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
              <p className="whitespace-pre-wrap text-body-13-medium text-[#BFBFBF]">{reply.content}</p>
              <div className="flex items-center gap-4 text-body-13-medium text-gray300">
                <button
                  onClick={handleLike}
                  disabled={isLoadingLike}
                  className={`flex items-center gap-[0.19rem] ${isLiked ? 'text-main' : 'text-gray300'}`}>
                  <Image
                    src={isLiked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
                    alt="heart"
                    width={16}
                    height={16}
                  />
                  {likeCount}
                </button>
              </div>
            </>
          )}
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
            isAnonymous={reply.isAnonymous}
            onCommentDelete={() => {
              // 자식댓글이 있는지 확인
              const childReplies = allComments.filter((c) => c.replyId === reply.id && !c.isBlocked);

              if (childReplies.length > 0) {
                // 자식댓글이 있으면 삭제된 상태로 표시
                setComments((prevComments) =>
                  prevComments.map((comment) => (comment.id === reply.id ? { ...comment, isDeleted: true } : comment)),
                );
              } else {
                // 자식댓글이 없으면 완전 삭제
                setComments((prevComments) => prevComments.filter((comment) => comment.id !== reply.id));
              }
            }}
            writerId={reply.writerId ? reply.writerId : undefined}
          />
        )}
      </div>
    );
  }

  // 부모 댓글(최상위 댓글) UI
  return (
    <div id={`comment-${reply.id}`} className="flex flex-col gap-2 px-5 py-1">
      <div
        className={classNames('flex flex-col gap-2 rounded-lg transition-colors', {
          '': isReplying,
        })}>
        {reply.isBlocked ? (
          renderBlockedComment()
        ) : reply.isDeleted ? (
          renderDeletedComment()
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center gap-[0.37rem] text-body-13-medium text-white">
                <Image
                  src={getDisplayImage(reply.imageUrl, reply.isWithdrawn, reply.isAnonymous)}
                  alt="profile"
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px] cursor-pointer rounded-full object-cover safari-icon-fix"
                  onClick={handleProfileClick}
                />
                {reply.isPostWriter && (
                  <span className={`font-bold text-main ${getDisplayStyle(reply.isWithdrawn)}`}>
                    {getDisplayName(reply.memberName, reply.isWithdrawn, reply.isAnonymous)}(작성자)
                  </span>
                )}
                {!reply.isPostWriter && (
                  <span className={`text-body-13-medium font-bold ${getDisplayStyle(reply.isWithdrawn)}`}>
                    {getDisplayName(reply.memberName, reply.isWithdrawn, reply.isAnonymous)}
                  </span>
                )}
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
            <p className="whitespace-pre-wrap text-body-13-medium text-[#BFBFBF]">{reply.content}</p>
            <div className="flex items-center gap-4 text-body-13-medium text-gray300">
              <button
                onClick={handleLike}
                disabled={isLoadingLike}
                className={`flex items-center gap-[0.19rem] ${isLiked ? 'text-main' : 'text-gray300'}`}>
                <Image
                  src={isLiked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
                  alt="heart"
                  width={16}
                  height={16}
                />
                <span className="min-w-[0.5rem]">{likeCount}</span>
              </button>
              <button onClick={handleReplyClick} className="text-gray300">
                {isReplying ? '답글 취소' : '답글 달기'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ✅ 자식 댓글 목록 렌더링 부분 수정 */}
      {childReplies.length > 0 && (
        <div className="flex flex-col gap-2">
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
                className={`flex items-start gap-2 ${child.isBlocked || child.isDeleted ? 'mt-[0.62rem]' : 'mt-1'}`}>
                <Image src="/icons/replyArrow.svg" alt="reply arrow" width={16} height={16} className="" />
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
          onCommentDelete={() => {
            // 자식댓글이 있는지 확인
            const childReplies = allComments.filter((c) => c.replyId === reply.id && !c.isBlocked);

            if (childReplies.length > 0) {
              // 자식댓글이 있으면 삭제된 상태로 표시
              setComments((prevComments) =>
                prevComments.map((comment) => (comment.id === reply.id ? { ...comment, isDeleted: true } : comment)),
              );
            } else {
              // 자식댓글이 없으면 완전 삭제
              setComments((prevComments) => prevComments.filter((comment) => comment.id !== reply.id));
            }
          }}
          writerId={reply.writerId ? reply.writerId : undefined}
        />
      )}
    </div>
  );
}

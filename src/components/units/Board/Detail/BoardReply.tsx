'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { formatRelativeTime } from '../BoardThread';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { accessTokenState, userProfileState, replyingToState, commentInputFocusState } from '@/context/recoil-context';
import { deleteComment } from '@/lib/actions/comment-controller/deleteComment';
import BoardDropdown from './BoardDropdown';
import { CommentType } from './BoardComments';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';

export type { CommentType as ReplyType };

interface Props {
  postId: number;
  reply: CommentType;
  allComments: CommentType[];
  isNested?: boolean;
  setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
}

export default function BoardReply({ postId, reply, allComments, isNested = false, setComments }: Props) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const [showMenu, setShowMenu] = useState(false);
  const iconRef = useRef<HTMLImageElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const [replyingTo, setReplyingTo] = useRecoilState(replyingToState);
  const setFocusTrigger = useSetRecoilState(commentInputFocusState);

  const isReplying = replyingTo?.parentId === reply.id;

  const handleReplyClick = () => {
    if (isReplying) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ parentId: reply.id, parentName: reply.isAnonymous ? '익명' : reply.memberName });
      setFocusTrigger((c) => c + 1);
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

  const formattedTime = formatRelativeTime(reply.createdAt);
  const childReplies = allComments.filter((c) => c.replyId === reply.id);

  // ✅ isNested prop에 따라 다른 UI 구조를 반환하도록 수정
  if (isNested) {
    // 자식 댓글(대댓글) UI
    return (
      <div id={`comment-${reply.id}`} className="w-full">
        {/* ✅ 스크린샷 디자인에 맞춰 회색 배경과 패딩을 적용합니다. */}
        <div
          className={classNames('flex w-full flex-col gap-[0.5rem] rounded-lg bg-gray700 p-3 transition-colors', {
            'bg-gray800': isReplying,
          })}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[0.37rem] text-[0.75rem] font-bold text-white">
              <Image
                src={userProfile?.profileImageUrl || '/icons/Mask group.svg'}
                alt="profile"
                width={24}
                height={24}
                className="rounded-full"
              />
              {reply.isAnonymous ? '익명' : reply.memberName}
              <span className="text-body3-12-medium text-gray200">· {formattedTime}</span>
            </div>
            {reply.isAuthor && (
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
            )}
          </div>
          <p className="whitespace-pre-wrap text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
          <div className="flex items-center gap-4 text-[0.75rem] text-gray300">
            <span className="flex items-center gap-[0.19rem]">
              <Image src="/icons/favorite.svg" alt="heart" width={16} height={16} />
              {reply.likes}
            </span>
          </div>
        </div>
        {showMenu && (
          <BoardDropdown onClose={() => setShowMenu(false)} onDelete={handleDelete} position={dropdownPosition} />
        )}
      </div>
    );
  }

  // 부모 댓글(최상위 댓글) UI
  return (
    <div id={`comment-${reply.id}`} className="flex flex-col p-4">
      <div
        className={classNames('-m-3 flex flex-col gap-[0.5rem] rounded-lg p-3 transition-colors', {
          '': isReplying,
        })}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.37rem] text-[0.75rem] font-bold text-white">
            <Image
              src={userProfile?.profileImageUrl || '/icons/Mask group.svg'}
              alt="profile"
              width={24}
              height={24}
              className="rounded-full"
            />
            {reply.isAnonymous ? '익명' : reply.memberName}
            <span className="text-body3-12-medium text-gray200">· {formattedTime}</span>
          </div>
          {reply.isAuthor && (
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
          )}
        </div>
        <p className="whitespace-pre-wrap text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
        <div className="flex items-center gap-4 text-[0.75rem] text-gray300">
          <span className="flex items-center gap-[0.19rem]">
            <Image src="/icons/favorite.svg" alt="heart" width={16} height={16} />
            {reply.likes}
          </span>
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
                <Image src="/icons/replyArrow.svg" alt="reply arrow" width={16} height={16} className="mt-3" />
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
        <BoardDropdown onClose={() => setShowMenu(false)} onDelete={handleDelete} position={dropdownPosition} />
      )}
    </div>
  );
}

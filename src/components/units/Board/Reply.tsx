'use client';

import { mockComments, mockBoardData } from '@/lib/dummyData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Image from 'next/image';

interface ReplyProps {
  postId: string;
  showPieceBar?: boolean;  // 조각 참여 바 표시 여부
  onScroll: (showJoinBar: boolean) => void;
  currentUserId?: string;  // 현재 로그인한 사용자의 ID
}

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: string;
  profileImage: string;
  content: string;
  timestamp: string;
  parentId: string | null;
}

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}

const Reply = ({ postId, showPieceBar = false, onScroll, currentUserId }: ReplyProps) => {
  const [showJoinBar, setShowJoinBar] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  
  // 현재 게시글의 댓글들을 가져오고 대댓글 구조로 정리
  const comments = useMemo(() => {
    const postComments = mockComments.filter(comment => comment.postId === postId);
    const mainComments = postComments.filter(comment => !comment.parentId);
    
    return mainComments.map(comment => ({
      ...comment,
      replies: postComments.filter(reply => reply.parentId === comment.id)
    }));
  }, [postId]);

  // 게시글 작성자 ID 가져오기
  const post = mockBoardData.find(p => p.id === postId);
  const postAuthorId = post?.authorId || '';  // 기본값 빈 문자열 설정

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const threshold = 20;  // 임계값을 20px로 낮춤
    onScroll(scrollTop > threshold);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }
    // TODO: API 호출하여 댓글 삭제
    console.log('댓글 삭제:', commentId);
    setSelectedCommentId(null);
  };

  const handleReportComment = async (commentId: string) => {
    if (!currentUserId) {
      alert('로그인이 필요합니다.');
      return;
    }
    // TODO: API 호출하여 댓글 신고
    console.log('댓글 신고:', commentId);
    setSelectedCommentId(null);
  };

  return (
    <div className="flex flex-1 flex-col border-t border-gray500">
      <div className="flex-1 overflow-y-auto pb-[4.5rem] scroll-container" onScroll={handleScroll}>
        <div className="">
          {comments.map((comment) => (
            <div key={comment.id} className=" p-4">
              {/* 메인 댓글 */}
              <CommentItem 
                comment={comment}
                postAuthorId={postAuthorId}
                selectedId={selectedCommentId}
                onSelect={setSelectedCommentId}
                onDelete={handleDeleteComment}
                onReport={handleReportComment}
                currentUserId={currentUserId}
              />
              
              {/* 대댓글 목록 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start justify-between w-full">
                      <div className="flex items-start w-full">
                        <div className="w-4 mr-3 ">
                          <img 
                            src="/icons/arrow-curve-left-right.svg" 
                            alt="reply" 
                            className="h-4 w-4"
                          />
                        </div>
                        <div className="flex-1 bg-gray500 p-4">
                          <CommentItem 
                            key={reply.id}
                            comment={reply}
                            postAuthorId={postAuthorId}
                            selectedId={selectedCommentId}
                            onSelect={setSelectedCommentId}
                            onDelete={handleDeleteComment}
                            onReport={handleReportComment}
                            currentUserId={currentUserId}
                            isReply
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 입력 부분 */}
      <motion.div 
        className="fixed bottom-0 w-full max-w-[600px] -translate-x-1/2 bg-gray500 border-t border-gray500"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
      >
        <div className="flex w-full items-center">
          <input 
            type="text"
            placeholder="댓글을 입력해주세요." 
            className="flex-1 bg-transparent text-body2-15-medium text-gray100 px-4 py-3 placeholder-gray300 focus:outline-none"
          />
          <button className="h-full bg-main text-white px-4 py-3 text-body2-15-medium">
            등록
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface CommentItemProps {
  comment: CommentWithReplies;
  postAuthorId: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
  currentUserId?: string;
  isReply?: boolean;
}

interface CommentDropdownProps {
  comment: CommentWithReplies;
  postAuthorId: string;
  currentUserId?: string;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
}

const CommentDropdown = ({ comment, postAuthorId, currentUserId, selectedId, onSelect, onDelete, onReport }: CommentDropdownProps) => {
  // 본인이 작성한 댓글인 경우에만 삭제 가능
  const isOwnComment = currentUserId && comment.authorId === currentUserId;

  return (
    <div className="relative">
      <img
        src="/icons/dot-vertical.svg"
        alt="More options"
        className="h-5 w-5 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selectedId === comment.id ? null : comment.id);
        }}
      />
      <AnimatePresence>
        {selectedId === comment.id && (
          <>
            {/* 배경 어둡게 처리 */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
            />

            {/* 드롭다운 메뉴 */}
            <motion.div
              initial={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-6 mt-4 w-[5.5rem] rounded-xs bg-gray700 shadow-lg z-20"
            >
              {isOwnComment ? (
                <button 
                  onClick={() => onDelete(comment.id)}
                  className="w-full px-5 py-2 text-center text-body3-12-medium text-red500 hover:brightness-110"
                >
                  삭제하기
                </button>
              ) : (
                <button 
                  onClick={() => onReport(comment.id)}
                  className="w-full px-5 py-2 text-center text-body3-12-medium text-gray200 hover:text-main"
                >
                  신고하기
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommentItem = ({ 
  comment, 
  postAuthorId, 
  selectedId, 
  onSelect, 
  onDelete, 
  onReport,
  currentUserId,
  isReply = false 
}: CommentItemProps) => {
  // 게시글 작성자인지 확인
  const isPostAuthor = comment.authorId === postAuthorId;
  // 댓글 작성자 본인인지 확인
  const isCommentAuthor = comment.authorId === currentUserId;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-2">
        <img 
          src={comment.profileImage} 
          alt="Profile" 
          className="h-8 w-8 rounded-full" 
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-body3-12-bold ${isPostAuthor ? 'text-main' : ''}`}>
              {comment.author}
              {isPostAuthor && (
                <span className="ml-1 text-body3-12-bold text-main">
                  (작성자)
                </span>
              )}
            </span>
            <span className="text-body3-12-medium text-gray300">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-body2-15-medium text-gray100 mt-1">
            {comment.content}
          </p>
        </div>
      </div>
      
      <CommentDropdown 
        comment={comment}
        postAuthorId={postAuthorId}
        currentUserId={currentUserId}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
        onReport={onReport}
      />
    </div>
  );
};

export default Reply; 
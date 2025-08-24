'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createComment, getComments, deleteComment } from '@/lib/actions/detail-controller/board/replyWriteUtils';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { GetNickname } from '@/lib/action';

interface ReplyProps {
  postId: string;
  showPieceBar?: boolean; // 조각 참여 바 표시 여부
  onScroll: (showJoinBar: boolean) => void;
  currentUserId?: string; // 현재 로그인한 사용자의 ID
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
  isAnonymous: boolean;
  isAuthor?: boolean;
}

interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}

const Reply = ({ postId, showPieceBar = false, onScroll, currentUserId }: ReplyProps) => {
  const [showJoinBar, setShowJoinBar] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [localComments, setLocalComments] = useState<CommentWithReplies[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const accessToken = useRecoilValue(accessTokenState);
  const [postData, setPostData] = useState<any>(null);

  // 게시글 정보 가져오기
  useEffect(() => {
    const getPostData = async () => {
      if (!postId || !accessToken) return;

      try {
        const post = await fetchPostDetail(postId, accessToken);
        if (post) {
          setPostData(post);
        }
      } catch (error) {
        console.error('게시글 정보 가져오기 실패:', error);
      }
    };

    getPostData();
  }, [postId, accessToken]);

  // postAuthorId 수정
  const postAuthorId = postData?.memberId?.toString() || '';

  // 현재 유저 정보 가져오기 - GetNickname 사용
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!accessToken) return;

      try {
        const response = await GetNickname(accessToken);
        const userInfo = await response.json();
        setCurrentUser(userInfo);
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
      }
    };

    fetchCurrentUser();
  }, [accessToken]);

  // 댓글 컨테이너 ref 선언
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false);

  // localComments가 변경될 때마다 스크롤 처리
  useEffect(() => {
    if (shouldScrollRef.current && commentContainerRef.current) {
      commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
      shouldScrollRef.current = false;
    }
  }, [localComments]);

  // 모든 댓글을 로드하는 함수
  const loadAllComments = async () => {
    if (!accessToken || !postId) return;

    try {
      let pageNum = 0;
      let allComments: Comment[] = [];
      let hasMoreComments = true;

      while (hasMoreComments) {
        const response = (await getComments(postId, pageNum, 10, accessToken)) as CommentResponse;

        const newComments = response.content.map((comment) => ({
          id: String(comment.id),
          postId: postId,
          authorId: String(comment.writerId || ''),
          author: comment.isAnonymous ? '익명' : comment.memberName || '알 수 없음',
          profileImage: comment.imageUrl || '/icons/default-avatar.svg',
          content: comment.content,
          timestamp: new Date(comment.createdAt).toLocaleString(),
          parentId: comment.replyId === 0 ? null : String(comment.replyId),
          isAnonymous: comment.isAnonymous,
          isAuthor: currentUser?.memberId === comment.writerId,
        }));

        allComments = [...allComments, ...newComments];
        hasMoreComments = response.content.length === 10;
        pageNum++;
      }

      setLocalComments(allComments);
      setHasMore(false);
      setPage(pageNum);

      // 스크롤 처리는 여기서 제거 (handleSubmitComment에서 직접 호출)
    } catch (error) {
      console.error('전체 댓글 로드 실패:', error);
    }
  };

  // 댓글 목록 불러오기
  const fetchComments = async (pageNum: number) => {
    if (!accessToken || !postId) return;

    try {
      const response = (await getComments(postId, pageNum, 10, accessToken)) as CommentResponse;

      const newComments = response.content.map((comment) => ({
        id: String(comment.id),
        postId: postId,
        authorId: String(comment.writerId || ''),
        author: comment.isAnonymous ? '익명' : comment.memberName || '알 수 없음',
        profileImage: comment.imageUrl || '/icons/default-avatar.svg',
        content: comment.content,
        timestamp: new Date(comment.createdAt).toLocaleString(),
        parentId: comment.replyId === 0 ? null : String(comment.replyId),
        isAnonymous: comment.isAnonymous,
        isAuthor: currentUser?.memberId === comment.writerId,
      }));

      if (pageNum === 0) {
        setLocalComments(newComments);
      } else {
        setLocalComments((prev) => [...prev, ...newComments]);
      }

      setHasMore(response.content.length === 10);
      setPage(pageNum + 1);
    } catch (error) {
      console.error('댓글 목록 불러오기 실패:', error);
    }
  };

  // 초기 로딩
  useEffect(() => {
    setPage(0);
    fetchComments(0);
  }, [postId, accessToken]);

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUserId || !accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await deleteComment(postId, Number(commentId), accessToken);
      // 로컬 상태에서 댓글 제거
      setLocalComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
      setSelectedCommentId(null);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
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

  const handleSubmitComment = async () => {
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요');
      return;
    }

    try {
      // 새 댓글 작성
      await createComment(postId, commentContent, isAnonymous, accessToken);

      // 입력 필드 초기화
      setCommentContent('');
      setIsAnonymous(false);

      // 스크롤 플래그 설정
      shouldScrollRef.current = true;

      // 전체 댓글 다시 로드
      await loadAllComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-1 flex-col border-t border-gray500 bg-BG-black">
      <div ref={commentContainerRef} className="flex-1 overflow-y-auto pb-[4.5rem]">
        <div className="">
          {localComments.map((comment) => (
            <div key={comment.id} className="p-4">
              {/* 메인 댓글 */}
              <CommentItem
                comment={comment}
                postAuthorId={postId}
                selectedId={selectedCommentId}
                onSelect={setSelectedCommentId}
                onDelete={handleDeleteComment}
                onReport={handleReportComment}
                currentUserId={currentUser?.memberId}
                isAuthor={comment.isAuthor}
              />

              {/* 대댓글 목록 */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex w-full items-start justify-between">
                      <div className="flex w-full items-start">
                        <div className="mr-3 w-4">
                          <img src="/icons/arrow-curve-left-right.svg" alt="reply" className="h-4 w-4" />
                        </div>
                        <div className="flex-1 bg-gray500 p-4">
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            postAuthorId={postId}
                            selectedId={selectedCommentId}
                            onSelect={setSelectedCommentId}
                            onDelete={handleDeleteComment}
                            onReport={handleReportComment}
                            currentUserId={currentUser?.memberId}
                            isReply
                            isAuthor={reply.isAuthor}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center p-4">
              <button
                onClick={() => fetchComments(page)}
                className="rounded-md bg-gray500 px-4 py-2 text-gray100 transition-colors hover:bg-gray600">
                댓글 더보기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 댓글 입력 부분 */}
      <motion.div
        className="fixed bottom-0 w-full max-w-[600px] -translate-x-1/2 border-t border-gray500 bg-gray500"
        initial={{ y: 0 }}
        animate={{ y: 0 }}>
        <div className="flex w-full flex-col">
          <div className="flex items-center border-b border-gray400 px-4 py-2">
            <label className="flex items-center space-x-2 text-gray200">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="form-checkbox h-4 w-4 rounded border-gray300 text-main"
              />
              <span className="text-body3-12-medium">익명으로 작성</span>
            </label>
          </div>
          <div className="flex w-full items-center">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력해주세요"
              className="flex-1 bg-transparent px-4 py-3 text-body2-15-medium text-gray100 placeholder-gray300 focus:outline-none"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentContent.trim() || !accessToken}
              className="h-full bg-main px-4 py-3 text-body2-15-medium text-white disabled:opacity-50">
              등록
            </button>
          </div>
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
  isAuthor?: boolean;
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

const CommentDropdown = ({
  comment,
  postAuthorId,
  currentUserId,
  selectedId,
  onSelect,
  onDelete,
  onReport,
}: CommentDropdownProps) => {
  // 본인이 작성한 댓글인지 확인
  const isOwnComment = currentUserId && String(comment.authorId) === String(currentUserId);

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
              className="fixed inset-0 z-10 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
            />

            {/* 드롭다운 메뉴 - 본인 댓글이면 삭제하기, 아니면 신고하기 */}
            <motion.div
              initial={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-6 z-20 mt-4 w-[5.5rem] rounded-xs bg-gray700 shadow-lg">
              <button
                onClick={() => (isOwnComment ? onDelete(comment.id) : onReport(comment.id))}
                className={`w-full px-5 py-2 text-center text-body3-12-medium ${
                  isOwnComment ? 'text-main' : 'text-gray200 hover:text-main'
                }`}>
                {isOwnComment ? '삭제하기' : '신고하기'}
              </button>
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
  isReply = false,
  isAuthor = false,
}: CommentItemProps) => {
  // 게시글 작성자와 댓글 작성자 비교
  const isPostAuthor = postAuthorId && comment.authorId === postAuthorId;
  const isCommentAuthor = currentUserId && comment.authorId === currentUserId;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-2">
        <Image
          src={comment.isAnonymous ? '/icons/default_profile.svg' : comment.profileImage}
          alt="Profile"
          className="h-8 w-8 rounded-full"
          width={32}
          height={32}
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className={`text-[0.8125rem] font-bold ${isPostAuthor ? 'text-main' : ''}`}>
              {comment.author}
              {isPostAuthor && <span className="ml-1 text-[0.75rem] font-bold text-main">(작성자)</span>}
            </span>
            <span className="text-[0.75rem] text-gray300">{comment.timestamp}</span>
          </div>
          <p className="mt-1 text-[0.8125rem] text-gray100">{comment.content}</p>
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

interface CommentAuthor {
  memberId: number;
  nickname?: string;
  profileImage?: string;
}

interface CommentResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Array<{
    id: number;
    content: string;
    isAnonymous: boolean;
    replyId: number | null;
    memberName: string;
    imageUrl: string;
    likes: number;
    createdAt: string;
    isAuthor: boolean;
    writerId: number;
    isFollowing: boolean;
    isBlocked: boolean;
    isDeleted: boolean;
    isPostWriter: boolean;
  }>;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}

// 서버에서 게시글 정보를 가져오는 함수 추가
const fetchPostDetail = async (postId: string, accessToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/piece/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`게시글 정보 가져오기 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('게시글 정보 가져오기 실패:', error);
    return null;
  }
};

export default Reply;

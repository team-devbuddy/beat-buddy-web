'use client';

import Image from 'next/image';
import BoardImageModal from '../BoardImageModal';
import { useState, useEffect, useRef } from 'react';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';
import {
  accessTokenState,
  followMapState,
  postLikeState,
  postScrapState,
  postCommentCountState,
  isBusinessState,
} from '@/context/recoil-context';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addPostLike } from '@/lib/actions/post-interaction-controller/addLike';
import { deletePostLike } from '@/lib/actions/post-interaction-controller/deleteLike';
import { addPostScrap } from '@/lib/actions/post-interaction-controller/addScrap';
import { deletePostScrap } from '@/lib/actions/post-interaction-controller/deleteScrap';
import BoardDropdown from '../BoardDropDown';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatRelativeTime } from '../BoardThread';

interface PostProps {
  postId: number;
  post: {
    id: number;
    profileImageUrl: string;
    title?: string;
    content: string;
    nickname: string;
    createAt: string;
    likes: number;
    scraps: number;
    comments: number;
    hashtags?: string[];
    imageUrls?: string[];
    writerId: number;
    liked: boolean;
    hasCommented: boolean;
    scrapped: boolean;
    isAuthor: boolean;
    role: string;
    views: number;
    isFollowing: boolean;
    isAnonymous: boolean;
    isWithdrawn: boolean;
  };
}

// 파일 확장자로 이미지/영상 구분
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

// 탈퇴한 사용자 처리를 위한 유틸리티 함수
const getDisplayName = (nickname: string, isWithdrawn?: boolean, isAnonymous?: boolean) => {
  if (isAnonymous) return '익명';
  if (isWithdrawn) return '(알 수 없음)';
  return nickname;
};

const getDisplayImage = (imageUrl?: string, isWithdrawn?: boolean, isAnonymous?: boolean) => {
  if (isAnonymous || isWithdrawn) return '/icons/default-profile.svg';
  return imageUrl || '/icons/default-profile.svg';
};

const getDisplayStyle = (isWithdrawn?: boolean) => {
  if (isWithdrawn) return 'text-gray200';
  return 'text-white';
};

export default function BoardDetail({ postId, post }: PostProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingScrap, setIsLoadingScrap] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [scraps, setScraps] = useState(post.scraps);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [hasCommented, setHasCommented] = useState(post.hasCommented);
  const dropdownTriggerRef = useRef<HTMLImageElement | null>(null);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeMap, setLikeMap] = useRecoilState(postLikeState);
  const [scrapMap, setScrapMap] = useRecoilState(postScrapState);
  const [commentCountMap, setCommentCountMap] = useRecoilState(postCommentCountState);
  const isBusiness = useRecoilValue(isBusinessState);
  // 🔥 렌더링 시점에 상태를 파생시켜 불필요한 재렌더링을 방지
  const liked = likeMap[post.id] ?? post.liked;
  const scrapped = scrapMap[post.id] ?? post.scrapped;
  const isFollowing = followMap[post.writerId] ?? post.isFollowing;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // 댓글 추가 시 UI 즉시 업데이트
  const handleCommentAdded = () => {
    console.log('댓글 추가됨!', { postId: post.id, before: commentCount });
    setCommentCount((prev) => {
      const newCount = prev + 1;
      console.log('댓글 수 업데이트:', { before: prev, after: newCount });
      return newCount;
    });
    setHasCommented(true);
    setCommentCountMap((prev) => ({ ...prev, [post.id]: (prev[post.id] || 0) + 1 }));
  };

  // 댓글 삭제 시 UI 즉시 업데이트
  const handleCommentDeleted = () => {
    console.log('댓글 삭제됨!', { postId: post.id, before: commentCount });
    setCommentCount((prev) => {
      const newCount = Math.max(0, prev - 1);
      console.log('댓글 수 업데이트:', { before: prev, after: newCount });
      // 댓글이 0개가 되면 hasCommented를 false로 설정
      if (newCount === 0) {
        setHasCommented(false);
      }
      return newCount;
    });
    setCommentCountMap((prev) => ({ ...prev, [post.id]: Math.max(0, (prev[post.id] || 0) - 1) }));
  };

  // 외부에서 댓글 상태 변경 시 동기화
  useEffect(() => {
    setCommentCount(post.comments);
    setHasCommented(post.hasCommented);
  }, [post.comments, post.hasCommented]);

  // 댓글 개수 변경 모니터링
  useEffect(() => {
    console.log('🔥 BoardDetail - 댓글 개수 변경됨:', post.comments);
  }, [post.comments]);

  // 댓글 상태 변경 모니터링
  useEffect(() => {
    console.log('🔥 BoardDetail - 댓글 상태 변경됨:', {
      hasCommented: post.hasCommented,
      commentCount: post.comments,
    });
  }, [post.hasCommented, post.comments]);

  // 댓글 관련 함수들을 외부로 노출 (부모 컴포넌트에서 사용)
  useEffect(() => {
    // 전역 객체에 함수 등록
    (window as any).commentHandlers = {
      ...(window as any).commentHandlers,
      [post.id]: {
        addComment: handleCommentAdded,
        deleteComment: handleCommentDeleted,
      },
    };

    return () => {
      // 컴포넌트 언마운트 시 정리
      if ((window as any).commentHandlers && (window as any).commentHandlers[post.id]) {
        delete (window as any).commentHandlers[post.id];
      }
    };
  }, [post.id]); // commentCount 의존성 제거

  const goToEdit = () => {
    router.push(`/board/write?postId=${post.id}`);
  };

  const goToUserProfile = () => {
    // 익명 게시글인 경우 프로필로 이동하지 않음
    if (post.isAnonymous) return;
    router.push(`/board/profile?writerId=${post.writerId}`);
  };

  const openDropdown = () => {
    if (dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom - 70, left: rect.right - 110 });
      setIsDropdownOpen(true);
    }
  };
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // URL 파라미터를 확인하여 자동으로 모달 열기
  useEffect(() => {
    const openModal = searchParams.get('openModal');
    const imageIndex = searchParams.get('imageIndex');

    if (openModal === 'true' && imageIndex !== null && post.imageUrls) {
      const index = parseInt(imageIndex, 10);
      if (index >= 0 && index < post.imageUrls.length) {
        setCurrentImageIndex(index);
        setIsModalOpen(true);

        // URL에서 파라미터 제거 (선택사항)
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [searchParams, post.imageUrls]);

  const handleFollow = async () => {
    if (loadingFollow || !accessToken) return;

    try {
      setLoadingFollow(true);
      if (!isFollowing) {
        await postFollow(post.writerId, accessToken);
        setFollowMap((prev) => ({ ...prev, [post.writerId]: true }));
      } else {
        await deleteFollow(post.writerId, accessToken);
        setFollowMap((prev) => ({ ...prev, [post.writerId]: false }));
      }
    } catch (err: any) {
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleLike = async () => {
    if (!accessToken || isLoadingLike) return;

    setIsLoadingLike(true);
    try {
      if (liked) {
        await deletePostLike(post.id, accessToken);
        setLikeMap((prev) => ({ ...prev, [post.id]: false }));
        setLikes((prev) => prev - 1);
      } else {
        await addPostLike(post.id, accessToken);
        setLikeMap((prev) => ({ ...prev, [post.id]: true }));
        setLikes((prev) => prev + 1);
      }
    } catch (err: any) {
    } finally {
      setIsLoadingLike(false);
    }
  };

  const handleScrap = async () => {
    if (!accessToken || isLoadingScrap) return;

    setIsLoadingScrap(true);
    try {
      if (scrapped) {
        await deletePostScrap(post.id, accessToken);
        setScrapMap((prev) => ({ ...prev, [post.id]: false }));
        setScraps((prev) => prev - 1);
      } else {
        await addPostScrap(post.id, accessToken);
        setScrapMap((prev) => ({ ...prev, [post.id]: true }));
        setScraps((prev) => prev + 1);
      }
    } catch (err: any) {
    } finally {
      setIsLoadingScrap(false);
    }
  };

  // 🔥 불필요한 재렌더링을 유발하던 useEffect 훅들을 모두 삭제했습니다.

  return (
    <div className="border-b-[0.375rem] border-gray700 bg-BG-black px-[1.25rem] pb-[1.25rem] pt-[0.5rem]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[0.62rem]">
          <div className="relative flex h-[37px] w-[37px] cursor-pointer items-center justify-center">
            <div className="h-full w-full overflow-hidden rounded-full bg-gray500" onClick={goToUserProfile}>
              <Image
                src={getDisplayImage(post.profileImageUrl, post.isWithdrawn, post.isAnonymous)}
                alt="profile"
                width={37}
                height={37}
                className="h-full w-full rounded-full object-cover safari-icon-fix"
                onClick={goToUserProfile}
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            {isBusiness && !post.isAnonymous && !post.isWithdrawn && (
              <Image
                src="/icons/businessMark.svg"
                alt="business-mark"
                width={9}
                height={9}
                className="absolute -right-[-0.5px] -top-[-1px] z-10 safari-icon-fix"
              />
            )}
          </div>
          <div>
            <p className={`text-body-14-bold ${getDisplayStyle(post.isWithdrawn)}`}>
              {getDisplayName(post.nickname, post.isWithdrawn, post.isAnonymous)}
            </p>
            <p className="text-body3-12-medium text-gray200">{formatRelativeTime(post.createAt)}</p>
          </div>
        </div>
        {!post.isAuthor && !post.isAnonymous && (
          <button
            onClick={handleFollow}
            className={`text-body-14-bold ${isFollowing ? 'text-gray200' : 'text-main'} disabled:opacity-50`}
            disabled={loadingFollow}>
            {isFollowing ? '팔로잉' : '팔로우'}
          </button>
        )}
      </div>
      <p className="py-[0.75rem] text-body1-16-bold text-white">{post.title}</p>
      <p className="whitespace-pre-wrap text-body-13-medium text-gray100">{post.content}</p>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mt-[0.75rem]">
          {post.imageUrls.length === 1 ? (
            // 1장일 경우: 가로 패딩 px-5에 맞춰 세로 폭 상관없이
            <div>
              <div
                onClick={() => handleImageClick(0)}
                className="cursor-pointer overflow-hidden rounded-[0.5rem] bg-gray600">
                {isVideo(post.imageUrls[0]) ? (
                  <div className="relative">
                    <video src={post.imageUrls[0]} className="w-full object-cover" preload="metadata" muted />
                    {/* 재생 버튼 오버레이 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Image src="/icons/play.svg" alt="재생" width={80} height={80} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={post.imageUrls[0]}
                    alt="post-img-0"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full object-cover"
                  />
                )}
              </div>
            </div>
          ) : post.imageUrls.length === 2 ? (
            // 2장일 경우: 최대 세로 450px, 가로 패딩 px-5에 맞춰 2장이 올라가도록
            <div className="grid grid-cols-2 gap-[0.5rem]">
              {post.imageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="cursor-pointer overflow-hidden rounded-[0.5rem] bg-gray600">
                  {isVideo(url) ? (
                    <div className="relative h-full w-full" style={{ maxHeight: '450px' }}>
                      <video src={url} className="h-full w-full object-cover" preload="metadata" muted />
                      {/* 재생 버튼 오버레이 */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Image src="/icons/play.svg" alt="재생" width={60} height={60} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={url}
                      alt={`post-img-${index}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-full w-full object-cover"
                      style={{ maxHeight: '450px' }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 3장 이상일 경우: 세로 220px에 맞춰 가로 폭 상관없이
            <div className="flex gap-[0.5rem] overflow-x-auto">
              {post.imageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="h-[220px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[0.5rem] bg-gray600">
                  {isVideo(url) ? (
                    <div className="relative h-full w-auto">
                      <video src={url} className="h-full w-auto object-cover" preload="metadata" muted />
                      {/* 재생 버튼 오버레이 */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Image src="/icons/play.svg" alt="재생" width={32} height={32} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={url}
                      alt={`post-img-${index}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ height: '220px', width: 'auto', objectFit: 'cover' }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isModalOpen && post.imageUrls && (
        <BoardImageModal
          images={post.imageUrls}
          initialIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="mt-[0.75rem] flex flex-wrap gap-[0.38rem]">
        {post.hashtags &&
          post.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-[0.5rem] bg-gray700 px-[0.5rem] pb-[0.25rem] pt-[0.19rem] text-body3-12-medium text-gray300">
              {tag}
            </span>
          ))}
      </div>
      <div className="flex justify-between">
        <div className="mt-[0.75rem] flex gap-[0.5rem] text-body3-12-medium text-gray300">
          <span className={`flex items-center gap-[0.12rem] ${liked ? 'text-main' : ''}`}>
            <button onClick={handleLike} disabled={isLoadingLike} title="좋아요" className="flex items-center">
              <Image
                src={liked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
                alt="heart"
                width={20}
                height={20}
              />
            </button>
            <span className="min-w-[0.45rem] text-left">{likes}</span>
          </span>
          <span className={`flex items-center gap-[0.12rem] ${hasCommented ? 'text-main' : ''}`}>
            <Image
              src={hasCommented ? '/icons/maps_ugc-pink.svg' : '/icons/maps_ugc.svg'}
              alt="comment"
              width={20}
              height={20}
            />
            <span className="min-w-[0.45rem] text-left">{commentCount}</span>
          </span>
          <span className={`flex items-center gap-[0.12rem] ${scrapped ? 'text-main' : ''}`}>
            <button onClick={handleScrap} disabled={isLoadingScrap} title="스크랩" className="flex items-center">
              <Image
                src={
                  scrapped ? '/icons/material-symbols_bookmark-pink.svg' : '/icons/material-symbols_bookmark-gray.svg'
                }
                alt="bookmark"
                width={20}
                height={20}
              />
            </button>
            <span className="min-w-[0.45rem] text-left">{scraps}</span>
          </span>
        </div>
        <div className="flex items-end gap-[0.63rem]">
          <p className="text-body3-12-medium text-gray300">조회 {post.views}회</p>
          <Image
            ref={dropdownTriggerRef}
            onClick={openDropdown}
            src="/icons/dot-vertical-row.svg"
            alt="bookmark"
            width={19}
            height={20}
            className="cursor-pointer"
          />
        </div>
      </div>
      {isDropdownOpen && dropdownPosition && (
        <BoardDropdown
          isAuthor={post.isAuthor}
          onClose={() => setIsDropdownOpen(false)}
          position={dropdownPosition}
          postId={post.id}
        />
      )}
    </div>
  );
}

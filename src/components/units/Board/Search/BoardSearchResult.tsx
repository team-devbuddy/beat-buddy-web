'use client';

import Image from 'next/image';
import BoardImageModal from '../BoardImageModal';
import { useState, useEffect } from 'react';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';
import {
  accessTokenState,
  postLikeState,
  postScrapState,
  followMapState,
  isBusinessState,
} from '@/context/recoil-context';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addPostLike } from '@/lib/actions/post-interaction-controller/addLike';
import { deletePostLike } from '@/lib/actions/post-interaction-controller/deleteLike';
import { addPostScrap } from '@/lib/actions/post-interaction-controller/addScrap';
import { deletePostScrap } from '@/lib/actions/post-interaction-controller/deleteScrap';
import BoardDropdown from '../BoardDropDown';
import { useRef } from 'react';
import { formatRelativeTime } from '../BoardThread';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import ProfileModal from '../../Common/ProfileModal';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';

// 파일 확장자로 이미지/영상 구분
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

interface PostProps {
  postId: number;
  post: {
    id: number;
    title?: string;
    content: string;
    nickname: string;
    createAt: string;
    likes: number;
    scraps: number;
    comments: number;
    hashtags: string[];
    imageUrls?: string[];
    followingId: number;
    liked: boolean;
    hasCommented: boolean;
    scrapped: boolean;
    isAuthor: boolean;
    writerId: number;
    profileImageUrl?: string;
    role?: string;
    isFollowing?: boolean;
    isAnonymous?: boolean;
    thumbImage?: string[];
    postProfileImageUrl?: string;
    postProfileNickname?: string;
    postProfileRole?: string;
    postProfileIsFollowing?: boolean;
  };
}

export default function BoardSearchResult({ postId, post }: PostProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingScrap, setIsLoadingScrap] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [scraps, setScraps] = useState(post.scraps);
  const dropdownTriggerRef = useRef<HTMLImageElement | null>(null);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeMap, setLikeMap] = useRecoilState(postLikeState);
  const [scrapMap, setScrapMap] = useRecoilState(postScrapState);
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const isBusiness = useRecoilValue(isBusinessState);
  const liked = likeMap[post.id] ?? false;
  const scrapped = scrapMap[post.id] ?? false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  // 게시판 프로필 관련 상태
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 팔로우 상태를 올바르게 처리
  const isFollowing = followMap[post.writerId] !== undefined ? followMap[post.writerId] : post.isFollowing ?? false;

  // 디버깅용 로그
  useEffect(() => {
    console.log('팔로우 상태:', {
      writerId: post.writerId,
      postIsFollowing: post.isFollowing,
      followMapValue: followMap[post.writerId],
      finalIsFollowing: isFollowing,
      isAuthor: post.isAuthor,
    });
  }, [post.writerId, post.isFollowing, followMap, isFollowing, post.isAuthor]);

  const category = 'free';

  // 게시판 프로필 존재 여부 확인
  const checkBoardProfile = async () => {
    try {
      const profileInfo = await getProfileinfo(accessToken);
      // 프로필 정보가 있고 닉네임이 있으면 게시판 프로필이 존재하는 것으로 간주
      return profileInfo.isPostProfileCreated;
    } catch (error) {
      console.error('게시판 프로필 확인 실패:', error);
      return false;
    }
  };

  // 상호작용 전 프로필 체크
  const handleInteractionWithProfileCheck = async (action: () => void) => {
    const hasProfile = await checkBoardProfile();
    if (!hasProfile) {
      setShowProfileModal(true);
      return;
    }
    action();
  };

  // 팔로우 상태 초기화 - followMap이 비어있을 때만 서버 데이터로 설정
  useEffect(() => {
    if (followMap[post.writerId] === undefined && post.isFollowing !== undefined) {
      console.log('팔로우 상태 초기화:', {
        writerId: post.writerId,
        postIsFollowing: post.isFollowing,
        willSet: true,
      });
      setFollowMap((prev) => ({ ...prev, [post.writerId]: !!post.isFollowing }));
    }
  }, [post.writerId, post.isFollowing, followMap, setFollowMap]);

  const goToUserProfile = () => {
    // 익명 게시글인 경우 프로필로 이동하지 않음
    if (post.isAnonymous) return;
    handleInteractionWithProfileCheck(() => {
      router.push(`/board/profile?writerId=${post.writerId}`);
    });
  };

  const openDropdown = () => {
    handleInteractionWithProfileCheck(() => {
      if (dropdownTriggerRef.current) {
        const rect = dropdownTriggerRef.current.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom - 70, left: rect.right - 110 });
        setIsDropdownOpen(true);
      }
    });
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleFollow = async () => {
    if (loadingFollow || !accessToken) return alert('로그인이 필요합니다.');

    handleInteractionWithProfileCheck(async () => {
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
        alert(err.message ?? '요청 실패');
      } finally {
        setLoadingFollow(false);
      }
    });
  };

  const handleLike = async () => {
    if (!accessToken || isLoadingLike) return;

    handleInteractionWithProfileCheck(async () => {
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
        alert(err.message ?? '요청 실패');
      } finally {
        setIsLoadingLike(false);
      }
    });
  };

  const handleScrap = async () => {
    if (!accessToken || isLoadingScrap) return;

    handleInteractionWithProfileCheck(async () => {
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
        alert(err.message ?? '요청 실패');
      } finally {
        setIsLoadingScrap(false);
      }
    });
  };

  useEffect(() => {
    if (likeMap[post.id] === undefined) {
      setLikeMap((prev) => ({ ...prev, [post.id]: post.liked }));
    }
  }, [post.id]);

  useEffect(() => {
    if (scrapMap[post.id] === undefined) {
      setScrapMap((prev) => ({ ...prev, [post.id]: post.scrapped }));
    }
  }, [post.id]);

  const goToPost = () => {
    handleInteractionWithProfileCheck(() => {
      router.push(`/board/${category}/${post.id}`);
    });
  };

  return (
    <div className="border-b border-gray700 bg-BG-black px-[1.25rem] py-[0.88rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.62rem]">
          <div className="relative flex h-[32px] w-[32px] cursor-pointer items-center justify-center">
            <div className="h-full w-full overflow-hidden rounded-full bg-gray500">
              <Image
                src={
                  post.isAnonymous
                    ? '/icons/default-profile.svg'
                    : post.postProfileImageUrl || '/icons/default-profile.svg'
                }
                alt="profile"
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover safari-icon-fix"
                onClick={goToUserProfile}
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            {isBusiness && !post.isAnonymous && (
              <Image
                src="/icons/businessMark.svg"
                alt="business-mark"
                width={9}
                height={9}
                className="absolute -right-0 -top-[-1px] z-10 safari-icon-fix"
              />
            )}
          </div>

          <div>
            <p className="text-body-14-bold text-white">{post.postProfileNickname}</p>
          </div>
        </div>

        {!post.isAuthor && (
          <button
            onClick={handleFollow}
            className={`text-[0.875rem] font-bold ${isFollowing ? 'text-gray200' : 'text-main'} disabled:opacity-50`}
            disabled={loadingFollow}>
            {isFollowing ? '팔로잉' : '팔로우'}
          </button>
        )}
      </div>
      <div onClick={goToPost}>
        {post.title && <p className="mb-[0.5rem] mt-[0.62rem] text-body-14-bold text-white">{post.title}</p>}
        <p
          className="whitespace-pre-wrap text-body-13-medium text-gray100"
          style={{
            lineHeight: '1.5',
            // 연속된 빈 줄의 높이 제한
            display: 'block',
            whiteSpace: 'pre-line',
          }}>
          {post.content
            .replace(/\n\s*\n\s*\n/g, '\n\n') // 3개 이상 줄바꿈을 2개로 제한
            .split('\n\n') // 빈 줄로 분할
            .map((paragraph, index, array) => (
              <span key={index}>
                {paragraph}
                {index < array.length - 1 && <span style={{ display: 'block', height: '0.5rem' }}></span>}
              </span>
            ))}
        </p>

        {post.thumbImage && post.thumbImage.length > 0 && (
          <div className="mt-[0.88rem] flex gap-[0.5rem] overflow-x-auto">
            {post.thumbImage.map((url: string, index: number) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(index);
                }}
                className="max-h-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[0.5rem] bg-gray600">
                {isVideo(url) ? (
                  <video src={url} className="h-[200px] w-auto object-cover" preload="metadata" muted />
                ) : (
                  <Image
                    src={url}
                    alt={`post-img-${index}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ height: '200px', width: 'auto', objectFit: 'contain' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && post.thumbImage && (
        <BoardImageModal
          images={post.thumbImage}
          initialIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="mt-[0.62rem] flex flex-wrap gap-[0.38rem]">
        {post.hashtags.map((tag) => (
          <span
            key={tag}
            className="rounded-[0.5rem] bg-gray700 px-[0.5rem] pb-1 pt-[0.19rem] text-body-11-medium text-gray300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="mt-[0.62rem] flex gap-[0.5rem] text-body3-12-medium text-gray300">
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
          <span className={`flex items-center gap-[0.12rem] ${post.hasCommented ? 'text-main' : ''}`}>
            <Image
              src={post.hasCommented ? '/icons/maps_ugc-pink.svg' : '/icons/maps_ugc.svg'}
              alt="comment"
              width={20}
              height={20}
            />
            <span className="min-w-[0.45rem] text-left">{post.comments}</span>
          </span>
          <span className={`flex items-center gap-[0.12rem] ${scrapped ? 'text-main' : ''}`}>
            <div className="flex max-h-[20px] max-w-[20px] items-center">
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
            </div>
            <span className="min-w-[0.45rem] text-left">{scraps}</span>
          </span>
        </div>
        <div className="flex items-end gap-[0.62rem]">
          <p className="text-body3-12-medium text-gray200">{formatRelativeTime(post.createAt, false)}</p>
          <Image
            ref={dropdownTriggerRef}
            onClick={openDropdown}
            src="/icons/dot-vertical-row.svg"
            alt="bookmark"
            width={19}
            height={20}
            className="z-100 cursor-pointer"
          />
        </div>
      </div>
      {isDropdownOpen && dropdownPosition && (
        <BoardDropdown
          isAuthor={post.isAuthor}
          onClose={() => setIsDropdownOpen(false)}
          position={dropdownPosition}
          postId={post.id}
          type="board"
        />
      )}

      {/* 게시판 프로필 생성 모달 */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
}

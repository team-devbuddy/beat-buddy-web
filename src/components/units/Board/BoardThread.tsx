'use client';

import Image from 'next/image';
import BoardImageModal from './BoardImageModal';
import { useState, useEffect } from 'react';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';
import { accessTokenState, postLikeState, postScrapState } from '@/context/recoil-context';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addPostLike } from '@/lib/actions/post-interaction-controller/addLike';
import { deletePostLike } from '@/lib/actions/post-interaction-controller/deleteLike';
import { addPostScrap } from '@/lib/actions/post-interaction-controller/addScrap';
import { deletePostScrap } from '@/lib/actions/post-interaction-controller/deleteScrap';
import BoardDropdown from './BoardDropDown';
import { useRouter } from 'next/navigation';
import { followMapState, userProfileState } from '@/context/recoil-context';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import ProfileModal from '../Common/ProfileModal';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';

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
    hashtags: string[];
    thumbImage?: string[];
    writerId: number;
    liked: boolean;
    hasCommented: boolean;
    scrapped: boolean;
    isAuthor: boolean;
    role: string;
    isFollowing: boolean;
    isAnonymous: boolean;
    imageUrls?: string[];
  };
}

export function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const time = new Date(isoString);
  const diff = (now.getTime() - time.getTime()) / 1000; // 단위: 초

  if (diff < 60) {
    return '방금 전';
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}분 전`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}시간 전`;
  } else {
    // yyyy-mm-dd HH:MM 형식을 yyyy.mm.dd HH:MM로 변경
    const dateStr = time.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const timeStr = time.toISOString().slice(11, 16); // "HH:MM"
    const formattedDate = dateStr.replace(/-/g, '.'); // "YYYY.MM.DD"
    return `${formattedDate} ${timeStr}`; // "YYYY.MM.DD HH:MM"
  }
}

// 파일 확장자로 이미지/영상 구분
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

export default function BoardThread({ postId, post }: PostProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingScrap, setIsLoadingScrap] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [scraps, setScraps] = useState(post.scraps);
  const [isAnonymous, setIsAnonymous] = useState(post.isAnonymous);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownTriggerRef = useRef<HTMLImageElement | null>(null);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeMap, setLikeMap] = useRecoilState(postLikeState);
  const [scrapMap, setScrapMap] = useRecoilState(postScrapState);
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const userProfile = useRecoilValue(userProfileState);
  const liked = likeMap[post.id] ?? false;
  const scrapped = scrapMap[post.id] ?? false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const [clickedFollow, setClickedFollow] = useState(false);

  // 게시판 프로필 관련 상태
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isFollowing = followMap[post.writerId] ?? post.isFollowing;

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
        const dropdownWidth = 89; // w-[5.5625rem] = 89px
        const dropdownHeight = 64; // 2개 항목 * 32px

        // 화면 오른쪽 끝에 가까우면 왼쪽으로 표시
        const shouldShowLeft = rect.right + dropdownWidth > window.innerWidth;

        // 화면 아래쪽 끝에 가까우면 위쪽으로 표시
        const shouldShowTop = rect.bottom + dropdownHeight > window.innerHeight;

        const left = shouldShowLeft ? rect.left - dropdownWidth : rect.right - 10;
        const top = shouldShowTop ? rect.top - dropdownHeight : rect.bottom - 80;

        setDropdownPosition({ top, left });
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
      // 애니메이션 시작
      setClickedFollow(true);

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
    <motion.div
      className="border-b border-gray700 bg-BG-black px-[1.25rem] py-[0.88rem]"
      initial={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      animate={isDeleting ? { opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 } : {}}
      onAnimationComplete={() => {
        if (isDeleting) {
          // 애니메이션 완료 후 부모 컴포넌트에서 제거
          // 부모 컴포넌트에서 처리하도록 이벤트 발생
          const event = new CustomEvent('postDeleted', { detail: { postId: post.id, type: 'post' } });
          window.dispatchEvent(event);
        }
      }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.62rem]">
          <div className="relative flex h-[32px] w-[32px] cursor-pointer items-center justify-center">
            <div className="h-full w-full overflow-hidden rounded-full bg-gray500">
              <Image
                src={
                  post.isAnonymous ? '/icons/default-profile.svg' : post.profileImageUrl || '/icons/default-profile.svg'
                }
                alt="profile"
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover safari-icon-fix"
                onClick={goToUserProfile}
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            {post.role === 'BUSINESS' && !post.isAnonymous && (
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
            <p className="text-[0.875rem] font-bold text-white">{post.isAnonymous ? '익명' : post.nickname}</p>
          </div>
        </div>

        {!post.isAuthor && !post.isAnonymous && (
          <motion.button
            onClick={handleFollow}
            className={`text-[0.875rem] font-bold ${isFollowing ? 'text-gray200' : 'text-main'} disabled:opacity-50`}
            disabled={loadingFollow}
            animate={clickedFollow ? { scale: 0.95 } : {}}
            onAnimationComplete={() => setClickedFollow(false)}>
            {isFollowing ? '팔로잉' : '팔로우'}
          </motion.button>
        )}
      </div>
      <div onClick={goToPost}>
        <p className="mb-[0.5rem] mt-[0.62rem] text-[0.875rem] font-bold text-gray100">{post.title}</p>
        <p
          className="whitespace-pre-wrap text-[0.8125rem] text-gray100"
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
      </div>

      {post.thumbImage && post.thumbImage.length > 0 && (
        <div className="mt-[0.88rem] flex gap-[0.5rem] overflow-x-auto">
          {post.thumbImage.map((url, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
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
            className="rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-gray300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="mt-[0.62rem] flex gap-[0.5rem] text-[0.75rem] text-gray300">
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
          <p className="text-[0.75rem] text-gray200">{formatRelativeTime(post.createAt)}</p>
          <Image
            ref={dropdownTriggerRef}
            onClick={openDropdown}
            src="/icons/dot-vertical.svg"
            alt="bookmark"
            width={19}
            height={20}
            className="z-100 rotate-90 cursor-pointer"
          />{' '}
        </div>
      </div>
      {isDropdownOpen && dropdownPosition && (
        <BoardDropdown
          isAuthor={post.isAuthor}
          onClose={() => setIsDropdownOpen(false)}
          position={dropdownPosition}
          postId={post.id}
          onPostDelete={() => setIsDeleting(true)}
          type="board"
        />
      )}

      {/* 게시판 프로필 생성 모달 */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </motion.div>
  );
}

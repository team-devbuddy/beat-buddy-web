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
import { followMapState } from '@/context/recoil-context';
import { useRef } from 'react';

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
    imageUrls?: string[];
    writerId: number;
    liked: boolean;
    hasCommented: boolean;
    scrapped: boolean;
    isAuthor: boolean;
    role: string;
    isFollowing: boolean;
    isAnonymous: boolean;
    thumbImage: string;
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
    return time.toISOString().slice(0, 10); // "YYYY-MM-DD"
  }
}

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
  const dropdownTriggerRef = useRef<HTMLImageElement | null>(null);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeMap, setLikeMap] = useRecoilState(postLikeState);
  const [scrapMap, setScrapMap] = useRecoilState(postScrapState);
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const liked = likeMap[post.id] ?? false;
  const scrapped = scrapMap[post.id] ?? false;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  const isFollowing = followMap[post.writerId] ?? post.isFollowing;

  const category = 'free';

  const goToUserProfile = () => {
    router.push(`/profile?writerId=${post.writerId}`);
  };

  const openDropdown = () => {
    if (dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom - 90, left: rect.right - 130 }); // 160은 dropdown width
      setIsDropdownOpen(true);
    }
  };
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleFollow = async () => {
    if (loadingFollow || !accessToken) return alert('로그인이 필요합니다.');

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
      alert(err.message ?? '요청 실패');
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
      alert(err.message ?? '요청 실패');
    } finally {
      setIsLoadingScrap(false);
    }
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
    router.push(`/board/${category}/${post.id}`);
  };

  return (
    <div className="border-b border-gray700 bg-BG-black px-[1.25rem] py-[1.12rem]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-[0.5rem]">
          <div className="relative flex h-[37px] w-[37px] cursor-pointer items-center justify-center rounded-full bg-gray500">
            <Image
              src={post.profileImageUrl || '/icons/mask Group.svg'}
              alt="profile"
              width={37}
              height={37}
              className="rounded-full object-cover"
              onClick={goToUserProfile}
            />
            {post.role === 'BUSINESS' && (
              <Image
                src="/icons/businessMark.svg"
                alt="business-mark"
                width={9}
                height={9}
                className="absolute -right-[1px] -top-[-1px]"
              />
            )}
          </div>

          <div>
            <p className="text-[0.875rem] font-bold text-white">{post.nickname}</p>
            <p className="text-body3-12-medium text-gray200">{formatRelativeTime(post.createAt)}</p>
          </div>
        </div>

        {!post.isAuthor && (
          <button
            onClick={handleFollow}
            className={`text-body2-15-bold ${isFollowing ? 'text-gray200' : 'text-main'} disabled:opacity-50`}
            disabled={loadingFollow}>
            {isFollowing ? '팔로잉' : '팔로우'}
          </button>
        )}
      </div>
      <div onClick={goToPost}>
        <p className="mb-[0.5rem] mt-[0.88rem] text-body2-15-bold text-gray100">{post.title}</p>
        <p className="whitespace-pre-wrap text-[0.75rem] text-gray100">{post.content}</p>
      </div>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mt-[0.88rem] flex gap-[0.5rem] overflow-x-auto">
          {post.imageUrls.map((url, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className="max-h-[200px] flex-shrink-0 cursor-pointer overflow-hidden rounded-[0.5rem] bg-gray600">
              <Image
                src={url}
                alt={`post-img-${index}`}
                width={0}
                height={0}
                sizes="100vw"
                style={{ height: '200px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      )}

      {isModalOpen && post.imageUrls && (
        <BoardImageModal
          images={post.imageUrls}
          initialIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="mt-[0.88rem] flex flex-wrap gap-[0.38rem]">
        {post.hashtags.map((tag) => (
          <span key={tag} className="rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.19rem] text-[0.75rem] text-gray300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="mt-[1rem] flex gap-[0.5rem] text-body3-12-medium text-gray300">
          <span className={`flex items-center gap-[0.12rem] ${liked ? 'text-main' : ''}`}>
            <button onClick={handleLike} disabled={isLoadingLike} title="좋아요" className="flex items-center">
              <Image
                src={liked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
                alt="heart"
                width={20}
                height={20}
              />
            </button>
            {likes}
          </span>
          <span className={`flex items-center gap-[0.12rem] ${post.hasCommented ? 'text-main' : ''}`}>
            <Image
              src={post.hasCommented ? '/icons/maps_ugc-pink.svg' : '/icons/maps_ugc.svg'}
              alt="comment"
              width={20}
              height={20}
            />
            {post.comments}
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
            {scraps}
          </span>
        </div>
        <div className="flex items-end gap-[0.5rem]">
          <Image
            ref={dropdownTriggerRef}
            onClick={openDropdown}
            src="/icons/dot-vertical.svg"
            alt="bookmark"
            width={20}
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
        />
      )}
    </div>
  );
}

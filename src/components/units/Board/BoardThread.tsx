// BoardThread.tsx
'use client';

import Image from 'next/image';
import BoardImageModal from './BoardImageModal';
import { useState } from 'react';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

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
  };
}

export default function BoardThread({ postId, post }: PostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleFollow = async () => {
    if (loadingFollow) return;

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setLoadingFollow(true);
      if (!isFollowing) {
        await postFollow(post.followingId, accessToken);
        setIsFollowing(true);
      } else {
        await deleteFollow(post.followingId, accessToken);
        setIsFollowing(false);
      }
    } catch (err: any) {
      alert(err.message ?? '요청 실패');
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className="border-b border-gray700 bg-BG-black px-[1.25rem] py-[1.12rem]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-[0.5rem]">
          <div className="rounded-full bg-gray500 flex items-center justify-center">
            <Image src="/icons/mask Group.svg" alt="profile" width={37} height={37} />
          </div>
          <div>
            <p className="text-[0.875rem] font-bold text-white">작성자 {post.nickname}</p>
            <p className="text-body3-12-medium text-gray200">{post.createAt}</p>
          </div>
        </div>
        <button
          onClick={handleFollow}
          className="text-body2-15-bold text-main disabled:opacity-50"
          disabled={loadingFollow}
        >
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
      </div>

      <p className="text-[0.75rem] text-gray100 mt-[0.88rem] whitespace-pre-wrap">{post.content}</p>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mt-[0.88rem] overflow-x-auto flex gap-[0.5rem]">
          {post.imageUrls.map((url, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className="max-h-[200px] rounded-[0.5rem] overflow-hidden bg-gray600 flex-shrink-0 cursor-pointer"
            >
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

      <div className="flex gap-[0.38rem] flex-wrap mt-[0.88rem]">
        {post.hashtags.map(tag => (
          <span
            key={tag}
            className="bg-gray700 text-[0.75rem] text-gray300 px-[0.5rem] py-[0.19rem] rounded-[0.5rem]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-[0.5rem] text-body3-12-medium text-gray300 mt-[1rem]">
        <span className="flex items-center gap-[0.12rem]">
          <Image src="/icons/favorite.svg" alt="heart" width={20} height={20} />
          {post.likes}
        </span>
        <span className="flex items-center gap-[0.12rem]">
          <Image src="/icons/maps_ugc.svg" alt="comment" width={20} height={20} />
          {post.comments}
        </span>
        <span className="flex items-center gap-[0.12rem]">
          <Image src="/icons/material-symbols_bookmark-gray.svg" alt="bookmark" width={20} height={20} />
          {post.scraps}
        </span>
      </div>
    </div>
  );
}

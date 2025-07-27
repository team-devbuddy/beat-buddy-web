'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, postLikeState, postScrapState } from '@/context/recoil-context';
import { addPostLike } from '@/lib/actions/post-interaction-controller/addLike';
import { deletePostLike } from '@/lib/actions/post-interaction-controller/deleteLike';
import { addPostScrap } from '@/lib/actions/post-interaction-controller/addScrap';
import { deletePostScrap } from '@/lib/actions/post-interaction-controller/deleteScrap';

interface PostItemProps {
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
    writerId: number;
    liked: boolean;
    hasCommented: boolean;
    scrapped: boolean;
    isAuthor: boolean;
  };
}

export default function PostItem({ post }: PostItemProps) {
  const router = useRouter();
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [isLoadingScrap, setIsLoadingScrap] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [scraps, setScraps] = useState(post.scraps);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const [likeMap, setLikeMap] = useRecoilState(postLikeState);
  const [scrapMap, setScrapMap] = useRecoilState(postScrapState);

  const liked = likeMap[post.id] ?? false;
  const scrapped = scrapMap[post.id] ?? false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleScrap = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/board/free/${post.id}`);
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

  return (
    <Link href={`/board/free/${post.id}`} className="block border-b border-gray700 bg-BG-black px-5 py-[0.88rem]">
      {post.title && <p className="mb-1 text-[0.875rem] font-bold text-white">{post.title}</p>}

      <p className="line-clamp-2 text-[0.75rem] text-gray300">{post.content}</p>

      {/* 이미지 표시 */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="mt-[0.88rem] flex gap-[0.5rem] overflow-x-auto">
          {post.imageUrls.map((url, index) => (
            <div key={index} className="max-h-[200px] flex-shrink-0 overflow-hidden rounded-[0.5rem] bg-gray600">
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

      {/* 해시태그 표시 */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="mt-[0.62rem] flex flex-wrap gap-[0.38rem]">
          {post.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.25rem] text-[0.6875rem] text-gray300">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2 text-[0.75rem] text-gray300">
        <div className={`flex items-center ${liked ? 'text-main' : 'text-gray300'} gap-[0.12rem]`}>
          <button onClick={handleLike} disabled={isLoadingLike} title="좋아요" className="flex items-center">
            <Image
              src={liked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
              alt="heart"
              width={20}
              height={20}
            />
          </button>
          <span>{likes}</span>
        </div>
        <div className={`flex items-center ${post.hasCommented ? 'text-main' : 'text-gray300'} gap-[0.12rem]`}>
          <button onClick={handleCommentClick} title="댓글" className="flex items-center">
            <Image
              src={post.hasCommented ? '/icons/maps_ugc-pink.svg' : '/icons/maps_ugc.svg'}
              alt="comment"
              width={20}
              height={20}
            />
          </button>
          <span>{post.comments}</span>
        </div>
        <div className={`flex items-center ${scrapped ? 'text-main' : 'text-gray300'} gap-[0.12rem]`}>
          <button onClick={handleScrap} disabled={isLoadingScrap} title="스크랩" className="flex items-center">
            <Image
              src={scrapped ? '/icons/material-symbols_bookmark-pink.svg' : '/icons/material-symbols_bookmark-gray.svg'}
              alt="bookmark"
              width={20}
              height={20}
            />
          </button>
          <span>{scraps}</span>
        </div>
      </div>
    </Link>
  );
}

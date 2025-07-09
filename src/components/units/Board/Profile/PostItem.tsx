'use client';

import Link from 'next/link';
import Image from 'next/image';

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
  return (
    <Link href={`/board/${post.id}`} className="block border-b border-gray700 bg-BG-black px-4 py-5">
      {post.title && <p className="mb-1 text-[0.875rem] font-bold text-white">{post.title}</p>}

      <p className="line-clamp-2 text-[0.75rem] text-gray300">{post.content}</p>

      <div className="mt-3 flex gap-2 text-[0.75rem] text-gray300">
        <div className={`flex items-center ${post.liked ? 'text-main' : 'text-gray300'} gap-[0.12rem]`}>
          <Image
            src={post.liked ? '/icons/favorite-pink.svg' : '/icons/favorite.svg'}
            alt="post"
            width={20}
            height={20}
          />
          <span>{post.likes}</span>
        </div>
        <div className={`flex items-center ${post.hasCommented ? 'text-main' : 'text-gray300'} gap-[0.12rem]`}>
          <Image
            src={post.hasCommented ? '/icons/maps_ugc-pink.svg' : '/icons/maps_ugc.svg'}
            alt="post"
            width={20}
            height={20}
          />

          <span>{post.comments}</span>
        </div>
        <div className={`flex items-center ${post.scrapped ? 'text-main' : 'text-gray300'} gap-[0.12rem]`}>
          <Image
            src={post.scrapped ? '/icons/material-symbols_bookmark.svg' : '/icons/material-symbols_bookmark-gray.svg'}
            alt="post"
            width={20}
            height={20}
          />

          <span>{post.scraps}</span>
        </div>
      </div>
    </Link>
  );
}

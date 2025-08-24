'use client';

import PostItem from '@/components/units/Board/Profile/PostItem';

export interface Post {
  id: number;
  title: string;
  content: string;
  timeAgo: string;
  like: number;
  comment: number;
  scrap: number;
  thumbImage?: string[];
}

interface BoardProfilePostsProps {
  posts: any[];
  lastPostRef?: (node: HTMLDivElement | null) => void;
}

export default function BoardProfilePosts({ posts, lastPostRef }: BoardProfilePostsProps) {
  return (
    <div>
      {posts.map((post, i) => {
        if (i === posts.length - 1 && lastPostRef) {
          return (
            <div key={`${post.id}-${i}`} ref={lastPostRef}>
              {/* post 컴포넌트 예시 */}
              <PostItem post={post} />
            </div>
          );
        }
        return <PostItem key={`${post.id}-${i}`} post={post} />;
      })}
    </div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import BoardProfileSingleScrap from './BoardProfileSingleScrap';

interface ScrapPostsProps {
  posts: any[];
  lastPostRef: (node: HTMLDivElement | null) => void;
}

export default function BoardProfileScrapPosts({ posts, lastPostRef }: ScrapPostsProps) {
  const [localPosts, setLocalPosts] = useState(posts);

  // posts가 변경될 때 localPosts 업데이트
  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleRemove = (id: number) => {
    setLocalPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <AnimatePresence>
      {localPosts.map((post, index) => {
        const isLast = index === localPosts.length - 1;

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={isLast ? lastPostRef : undefined}>
            <BoardProfileSingleScrap postId={post.id} post={post} onRemove={() => handleRemove(post.id)} />
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

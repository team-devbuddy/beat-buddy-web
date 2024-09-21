import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  description: string;
  createdAt: string; // 데이터가 생성된 시각 (ISO string 형식)
  likes: number;
    comments: number;
    boardName: string;
}

interface HotPostProps {
  posts: Post[];
}

const HotPost = ({ posts }: HotPostProps) => {
  const [timeDiffs, setTimeDiffs] = useState<string[]>([]);

  // 시간계산함수
  const calculateTimeDiff = (createdAt: string): string => {
    const postTime = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    }
  };

  useEffect(() => {
    const diffs = posts.map((post) => calculateTimeDiff(post.createdAt));
    setTimeDiffs(diffs);
  }, [posts]);

  return (
    <div className="bg-gray400 px-4">
      <div className="flex cursor-pointer items-center justify-between py-[0.5rem] hover:brightness-75">
        <div className="flex flex-col justify-center">
          <span className="font-queensides text-[1.375rem] text-main2">HotPost </span>
          <span className="text-body2-15-medium text-gray200">버디끼리만 공유하는 핫한 정보!</span>
        </div>
        <Image src="/icons/ArrowHeadRight.svg" alt="Arrow head right icon" width={24} height={24} />
      </div>
      <div className="pb-[1.25rem] pt-[1.5rem] space-y-[0.62rem]">
        {posts.map((post, index) => (
          <div key={post.id} className=" rounded-sm bg-BG-black px-4 py-[1.25rem] ">
            <div className="flex justify-between">
              <p className="mb-[0.25rem] text-body2-15-bold text-white">{post.title}</p>
              <span className="text-[0.6875rem] text-[#7C7F83]">{timeDiffs[index]}</span>
            </div>
            <p className="mb-[0.25rem] text-[0.75rem] text-[#BFBFBF]">{post.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-[0.6875rem] text-[#7C7F83]">자유게시판</span>

              <div className="flex items-center justify-between space-x-[0.5rem]">
                <div className="flex space-x-[0.12rem]">
                  <Image src="/icons/thumb-up.svg" alt="thumbs up icon" width={11} height={11} />
                  <span className="text-[0.6875rem] text-[#EE1171]">{post.likes}</span>
                </div>
                <div className="flex space-x-[0.12rem]">
                  <Image src="/icons/message-square.svg" alt="thumbs up icon" width={11} height={11} />
                  <span className="text-[0.6875rem] text-[#BFBFBF]">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotPost;

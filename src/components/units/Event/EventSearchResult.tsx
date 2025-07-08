'use client';

import Image from 'next/image';
import BoardImageModal from '@/components/units/Board/BoardImageModal';
import { useState, useEffect } from 'react';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';
import { accessTokenState, postLikeState, postScrapState } from '@/context/recoil-context';
import { useRecoilState, useRecoilValue } from 'recoil';
import { addPostLike } from '@/lib/actions/post-interaction-controller/addLike';
import { deletePostLike } from '@/lib/actions/post-interaction-controller/deleteLike';
import { addPostScrap } from '@/lib/actions/post-interaction-controller/addScrap';
import { deletePostScrap } from '@/lib/actions/post-interaction-controller/deleteScrap';
import BoardDropdown from '@/components/units/Board/BoardDropDown';
import { useRef } from 'react';
import { formatRelativeTime } from '@/components/units/Board/BoardThread';

interface PostProps {
  eventId: number;
  event: {
    eventId: number;
    title?: string;
    content: string;
    images: string[];
    liked: boolean;
    likes: number;
    views: number;
    startDate: string;
    endDate: string;
    receiveInfo: boolean;
    receiveName: boolean;
    receiveGender: boolean;
    receivePhoneNumber: boolean;
    receiveSNSId: boolean;
    receiveMoney: boolean;
    depositAccount: string;
    depositAmount: number;
    isAuthor: boolean;
  };
}

export default function EventSearchResult({ eventId, event }: PostProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [isLoadingLike, setIsLoadingLike] = useState(false);
    const [isLoadingScrap, setIsLoadingScrap] = useState(false);
    const [likes, setLikes] = useState(event.likes);
    const [views, setViews] = useState(event.views);
    const dropdownTriggerRef = useRef<HTMLImageElement | null>(null);

    const accessToken = useRecoilValue(accessTokenState) || '';
    const [likeMap, setLikeMap] = useRecoilState(postLikeState);
    const [scrapMap, setScrapMap] = useRecoilState(postScrapState);

    const liked = likeMap[event.eventId] ?? false;
    const scrapped = scrapMap[event.eventId] ?? false;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

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
                await postFollow(event.eventId, accessToken);
                setIsFollowing(true);
            } else {
                await deleteFollow(event.eventId, accessToken);
                setIsFollowing(false);
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
                await deletePostLike(event.eventId, accessToken);
                setLikeMap(prev => ({ ...prev, [event.eventId]: false }));
                setLikes(prev => prev - 1);
            } else {
                await addPostLike(event.eventId, accessToken);
                setLikeMap(prev => ({ ...prev, [event.eventId]: true }));
                setLikes(prev => prev + 1);
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
                await deletePostScrap(event.eventId, accessToken);
                setScrapMap(prev => ({ ...prev, [event.eventId]: false }));
                setViews(prev => prev - 1);
            } else {
                await addPostScrap(event.eventId, accessToken);
                setScrapMap(prev => ({ ...prev, [event.eventId]: true }));
                setViews(prev => prev + 1);
            }
        } catch (err: any) {
            alert(err.message ?? '요청 실패');
        } finally {
            setIsLoadingScrap(false);
        }
    };

    useEffect(() => {
        if (likeMap[event.eventId] === undefined) {
            setLikeMap(prev => ({ ...prev, [event.eventId]: event.liked }));
        }
    }, [event.eventId]);

    useEffect(() => {
        if (scrapMap[event.eventId] === undefined) {
            setScrapMap(prev => ({ ...prev, [event.eventId]: event.liked }));
        }
    }, [event.eventId]);



    return (
        <div className="border-b border-gray700 bg-BG-black px-[1.25rem] py-[1.12rem]">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-[0.5rem]">
                    <div className="rounded-full bg-gray500 flex items-center justify-center">
                        <Image src="/icons/mask Group.svg" alt="profile" width={37} height={37} />
                    </div>
                    <div>
                        <p className="text-[0.875rem] font-bold text-white">{event.title}</p>
                        <p className="text-body3-12-medium text-gray200">{formatRelativeTime(event.startDate)}</p>
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

            <p className="text-[0.75rem] text-gray100 mt-[0.88rem] whitespace-pre-wrap">{event.content}</p>

            {event.images && event.images.length > 0 && (
                <div className="mt-[0.88rem] overflow-x-auto flex gap-[0.5rem]">
                    {event.images.map((url, index) => (
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

            {isModalOpen && event.images && (
                <BoardImageModal
                    images={event.images}
                    initialIndex={currentImageIndex}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <div className="flex gap-[0.38rem] flex-wrap mt-[0.88rem]">
                {event.images.map((tag: string) => (
                    <span
                        key={tag}
                        className="bg-gray700 text-[0.75rem] text-gray300 px-[0.5rem] py-[0.19rem] rounded-[0.5rem]"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div className="flex justify-between">
                <div className="flex gap-[0.5rem] text-body3-12-medium text-gray300 mt-[1rem]">
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
                    <span className={`flex items-center gap-[0.12rem] ${event.views ? 'text-main' : ''}`}>
                        <Image
                            src={event.views ? '/icons/maps_ugc-pink.svg' : '/icons/maps_ugc.svg'}
                            alt="comment"
                            width={20}
                            height={20}
                        />
                        {event.views}
                    </span>
                    <span className={`flex items-center gap-[0.12rem] ${scrapped ? 'text-main' : ''}`}>
                        <button onClick={handleScrap} disabled={isLoadingScrap} title="스크랩" className="flex items-center">
                            <Image
                                src={scrapped ? '/icons/material-symbols_bookmark-pink.svg' : '/icons/material-symbols_bookmark-gray.svg'}
                                alt="bookmark"
                                width={20}
                                height={20}
                            />
                        </button>
                        {views}
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
  className="cursor-pointer rotate-90"
/>                </div>
            </div>
            {isDropdownOpen && dropdownPosition && (
                <BoardDropdown
                    isAuthor={event.isAuthor}
                    onClose={() => setIsDropdownOpen(false)}
                    position={dropdownPosition}
                    postId={event.eventId}
                    eventId={event.eventId}
                />
            )}
        </div>
    );

}
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { ClubProps } from '@/lib/types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { CustomToast, CustomToastContainer } from '@/components/common/toast/CustomToastContainer';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';
import BoardImageModal from '@/components/units/Board/BoardImageModal';

const Preview = ({ venue, isHeartbeat, tagList }: ClubProps) => {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clickedHeart, setClickedHeart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const defaultImage = '/images/DefaultImage.png';

  const media =
    venue.backgroundUrl && venue.backgroundUrl.length > 0 ? venue.backgroundUrl : [venue.logoUrl || defaultImage];

  useEffect(() => {
    setLikedClubs((prevLikedClubs) => ({
      ...prevLikedClubs,
      [venue.id]: isHeartbeat,
    }));
  }, [isHeartbeat, setLikedClubs, venue.id]);

  useEffect(() => {
    const firstSlideVideo = document.querySelector<HTMLVideoElement>('.slick-slide.slick-active video');
    if (firstSlideVideo) {
      firstSlideVideo.play();
    }
  }, [media]);

  const handleHeartClickWrapper = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickedHeart(true);
    await handleHeartClick(e, venue.id, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
    setTimeout(() => setClickedHeart(false), 500);
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleShareClick = () => {
    const url = window.location.href;
    const title = venue.englishName || 'BeatBuddy';
    const text = `${venue.englishName} - BeatBuddy에서 확인해보세요!`;

    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => fallbackShare());
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    draggable: true,
    swipe: true,
    touchMove: true,
    touchThreshold: 5,
    swipeToSlide: true,
    beforeChange: () => {
      const videos = document.querySelectorAll<HTMLVideoElement>('.slick-slide video');
      videos.forEach((video) => {
        if (!video.paused) video.pause();
      });
    },
    afterChange: (current: number) => {
      setCurrentSlide(current);
      const video = document.querySelector<HTMLVideoElement>(`.slick-slide[data-index="${current}"] video`);
      if (video) video.play();
    },
  };

  const atmosphereMap: { [key: string]: string } = {
    CLUB: '클럽',
    PUB: '펍',
    ROOFTOP: '루프탑',
    DEEP: '딥한',
    COMMERCIAL: '커머셜한',
    CHILL: '칠한',
    EXOTIC: '이국적인',
    HUNTING: '헌팅',
  };

  const genresMap: { [key: string]: string } = {
    HIPHOP: 'HIPHOP',
    'R&B': 'R&B',
    EDM: 'EDM',
    HOUSE: 'HOUSE',
    TECHNO: 'TECHNO',
    'SOUL&FUNK': 'SOUL&FUNK',
    ROCK: 'ROCK',
    LATIN: 'LATIN',
    'K-POP': 'K-POP',
    POP: 'POP',
  };

  const locationsMap: { [key: string]: string } = {
    HONGDAE: '홍대',
    ITAEWON: '이태원',
    'GANGNAM/SINSA': '강남/신사',
    APGUJEONG: '압구정',
    OTHERS: '기타',
  };

  const translateTag = (tag: string) => {
    return atmosphereMap[tag] || genresMap[tag] || locationsMap[tag] || tag;
  };

  return (
    <div className="relative flex h-[21.875rem] w-full flex-col justify-between">
      <CustomToastContainer />
      {/* 상단 헤더 (overlay) */}
      <div className="pointer-events-none absolute z-20 flex w-full items-start justify-between pt-[0.88rem] pb-[0.87rem] pl-5 pr-4">
        <button onClick={() => router.back()} aria-label="뒤로가기" className="pointer-events-auto text-white">
          <Image src="/icons/arrow_back_ios.svg" alt="back icon" width={24} height={24} />
        </button>
        <div className="flex items-center space-x-3">
          <div onClick={handleShareClick} className="pointer-events-auto cursor-pointer">
            <Image src="/icons/share.svg" alt="share icon" width={26} height={26} />
          </div>
          <motion.div
            onClick={handleHeartClickWrapper}
            className="pointer-events-auto cursor-pointer"
            variants={heartAnimation}
            initial="initial"
            animate={clickedHeart ? 'clicked' : 'initial'}>
            <Image
              src={likedClubs[venue.id] ? '/icons/FilledHeart.svg' : '/icons/whiteHeart-detail.svg'}
              alt="heart icon"
              width={26}
              height={26}
            />
          </motion.div>
        </div>
      </div>

      {/* 슬라이더 */}
      <Slider ref={sliderRef} {...settings} className="absolute inset-0 z-10 h-full w-full touch-pan-x">
        {media.map((url, index) => (
          // 🔧 래퍼에 onClick 부여 (오버레이 포함 전체를 클릭 타겟으로)
          <div
            key={index}
            className="relative h-[21.875rem] w-full"
            onClick={() => handleImageClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleImageClick(index)}>
            {url.match(/\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i) ? (
              <Image src={url} alt={`Background ${index}`} fill className="object-cover object-center" />
            ) : url.match(/\.mp4|MOV$/i) ? (
              <video key={`video-${index}`} className="h-full w-full object-cover" muted loop playsInline>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                key={`default-${index}`}
                src={defaultImage}
                alt="Default Image"
                fill
                className="object-cover object-center"
              />
            )}

            {/* 🔧 오버레이가 클릭을 막지 않도록 pointer-events-none 추가 */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          </div>
        ))}
      </Slider>

      {/* 하단 정보 (overlay) */}
      <div className="pointer-events-none absolute bottom-0 z-20 flex w-full flex-col items-start gap-[0.38rem] px-[1rem] py-[1.25rem] text-white">
        <h1 className="w-4/5 text-title-24-bold">{venue.englishName}</h1>
        <div className="flex w-full items-end justify-between">
          <div className="flex w-4/5 flex-wrap gap-2">
            {tagList && tagList.length > 0 ? (
              tagList.map((tag: string, index: number) => {
                const translatedTag = translateTag(tag);
                return (
                  <span
                    key={index}
                    className="rounded-[0.5rem] border border-gray500 bg-gray500 px-[0.5rem] py-[0.25rem] text-body-13-medium text-gray300">
                    {translatedTag}
                  </span>
                );
              })
            ) : (
              <span className="text-body-13-medium text-gray300">No tags available</span>
            )}
          </div>

          <div className="rounded-[0.5rem] bg-[#17181CB2]/70 px-[0.5rem] py-[0.19rem] text-body-11-medium text-gray300">
            {currentSlide + 1}/{media.length}
          </div>
        </div>
      </div>

      {/* 이미지 모달 */}
      {isModalOpen && (
        <BoardImageModal images={media} initialIndex={currentImageIndex} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Preview;

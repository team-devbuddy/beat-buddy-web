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

const Preview = ({ venue, isHeartbeat, tagList }: ClubProps) => {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clickedHeart, setClickedHeart] = useState(false); // 추가된 상태

  const defaultImage = '/images/DefaultImage.png';

  const media =
    venue.backgroundUrl && venue.backgroundUrl.length > 0 ? venue.backgroundUrl : [venue.logoUrl || defaultImage];

  useEffect(() => {
    setLikedClubs((prevLikedClubs) => ({
      ...prevLikedClubs,
      [venue.venueId]: isHeartbeat,
    }));
  }, [isHeartbeat, setLikedClubs, venue.venueId]);

  useEffect(() => {
    const firstSlideVideo = document.querySelector<HTMLVideoElement>('.slick-slide.slick-active video');
    if (firstSlideVideo) {
      firstSlideVideo.play();
    }
  }, [media]);

  const handleHeartClickWrapper = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setClickedHeart(true); // 하트 클릭 애니메이션 상태 설정
    await handleHeartClick(e, venue.venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
    setTimeout(() => setClickedHeart(false), 500); // 애니메이션 상태 초기화
  };

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast(<CustomToast>링크가 복사되었어요!</CustomToast>);
      })
      .catch((err) => {
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
    beforeChange: (current: number, next: number) => {
      const videos = document.querySelectorAll<HTMLVideoElement>('.slick-slide video');
      videos.forEach((video) => {
        if (!video.paused) {
          video.pause();
        }
      });
    },
    afterChange: (current: number) => {
      setCurrentSlide(current);
      const video = document.querySelector<HTMLVideoElement>(`.slick-slide[data-index="${current}"] video`);
      if (video) {
        video.play();
      }
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
    const translatedTag = atmosphereMap[tag] || genresMap[tag] || locationsMap[tag] || tag;
    return translatedTag;
  };

  return (
    <div className="relative flex h-[17.5rem] w-full flex-col justify-between">
      <CustomToastContainer />
      <div className="absolute z-20 flex w-full items-start justify-between px-[1rem] py-[1rem]">
        <button onClick={() => router.back()} aria-label="뒤로가기" className="text-white">
          <Image src="/icons/ArrowLeft.svg" alt="back icon" width={24} height={24} />
        </button>
        <div className="flex items-center space-x-[1.25rem]">
          <div onClick={handleShareClick} className="cursor-pointer">
            <Image src="/icons/share.svg" alt="share icon" width={32} height={32} />
          </div>
          <motion.div
            onClick={handleHeartClickWrapper}
            className="cursor-pointer"
            variants={heartAnimation}
            initial="initial"
            animate={clickedHeart ? 'clicked' : 'initial'}
          >
            <Image
              src={likedClubs[venue.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
              alt="heart icon"
              width={32}
              height={32}
            />
          </motion.div>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings} className="absolute inset-0 z-10 h-full w-full">
        {media.map((url, index) => (
          <div key={index} className="relative h-[17.5rem] w-full">
            {url.match(/\.(jpeg|jpg|gif|png|heic|jfif|webp)$/i) ? (
              <Image src={url} alt={`Background ${index}`} fill className="object-cover object-center" />
            ) : url.match(/\.mp4|MOV$/i) ? (
              <video key={`video-${index}`} className="h-full w-full object-cover" controls muted loop playsInline>
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
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          </div>
        ))}
      </Slider>
      <div className="absolute bottom-0 z-20 flex w-full flex-col items-start gap-[1rem] px-[1rem] py-[1.25rem] text-white">
        <h1 className="w-4/5 text-title-24-bold">
          {venue.englishName} {venue.koreanName}
        </h1>
        <div className="flex w-full items-end justify-between">
          <div className="flex w-5/6 flex-wrap gap-2">
            {tagList && tagList.length > 0 ? (
              tagList.map((tag: string, index: number) => {
                const translatedTag = translateTag(tag);
                return (
                  <span
                    key={index}
                    className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                    {translatedTag}
                  </span>
                );
              })
            ) : (
              <span className="text-body3-12-medium text-gray100">No tags available</span>
            )}
          </div>

          <div className="rounded-[1rem] bg-gray700 px-[0.75rem] py-[0.25rem] text-body3-12-bold text-white">
            {currentSlide + 1}&nbsp; /&nbsp; {media.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;

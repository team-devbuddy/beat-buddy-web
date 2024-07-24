'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { checkHeart } from '@/lib/actions/hearbeat-controller/checkHeart';
import { ClubProps } from '@/lib/types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Preview = ({ club }: ClubProps) => {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);

  const defaultImage = '/images/DefaultImage.png';

  const media =
    club.backgroundUrl.length > 0
      ? club.backgroundUrl.map((url) => {
          if (url.match(/\.(jpeg|jpg|gif|png|heic|mp4)$/i)) {
            return url;
          } else {
            return defaultImage;
          }
        })
      : [defaultImage];

  useEffect(() => {
    const checkClubHeartStatus = async () => {
      if (accessToken) {
        const isLiked = await checkHeart(club.venueId, accessToken);
        setLikedClubs((prevLikedClubs) => ({
          ...prevLikedClubs,
          [club.venueId]: isLiked,
        }));
      }
    };

    checkClubHeartStatus();
  }, [accessToken, club.venueId, setLikedClubs]);

  useEffect(() => {
    console.log('Filtered Media:', media);
  }, [media]);

  const handleHeartClickWrapper = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    await handleHeartClick(e, club.venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
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
  };

  return (
    <div className="relative flex h-[17.5rem] w-full flex-col justify-between">
      <div className="absolute z-20 flex w-full items-start justify-between px-[1rem] py-[1rem]">
        <button onClick={() => router.back()} aria-label="뒤로가기" className="text-white">
          <Image src="/icons/ArrowLeft.svg" alt="back icon" width={24} height={24} />
        </button>
        <div className="flex items-center space-x-[1.25rem]">
          <Image src="/icons/share.svg" alt="share icon" width={32} height={32} />
          <div onClick={handleHeartClickWrapper} className="cursor-pointer">
            <Image
              src={likedClubs[club.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
              alt="heart icon"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
      <Slider {...settings} className="absolute inset-0 z-10 h-full w-full">
        {media.map((url, index) => (
          <div key={index} className="relative h-[17.5rem] w-full">
            {url.match(/\.(jpeg|jpg|gif|png|heic)$/i) ? (
              <Image src={url} alt={`Background ${index}`} fill className="object-cover object-center" />
            ) : url.match(/\.mp4$/i) ? (
              <video key={`video-${index}`} className="h-full w-full object-cover" controls>
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
      <div className="absolute bottom-0 z-20 flex flex-col items-start gap-[1rem] px-[1rem] py-[1.25rem] text-white">
        <h1 className="text-title-24-bold">{club.englishName}</h1>
        <div className="flex space-x-[0.5rem]">
          {/*club.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
              {tag}
            </span>
          ))*/}
        </div>
      </div>
    </div>
  );
};

export default Preview;

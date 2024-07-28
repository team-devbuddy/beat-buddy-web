'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { ClubProps } from '@/lib/types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const CustomToast = styled.div`
  background: #313335;
  color: #fff;
  font-size: 0.9375rem;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 1.40625rem */
  letter-spacing: -0.01875rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: none;
    box-shadow: none;
    padding: 0;
  }
  .Toastify__toast-body {
    margin: 0 1rem 0 1rem;
    padding: 0.75rem 1rem;
    background-color: #313335;
    border-radius: 0.25rem;
    color: #fff;
    margin-bottom: 2.25rem;
  }
  .Toastify__close-button {
    display: none;
  }
`;

const Preview = ({ venue, isHeartbeat, tagList }: ClubProps) => {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const sliderRef = useRef<Slider>(null);

  const defaultImage = '/images/DefaultImage.png';

  const media =
    venue.backgroundUrl && venue.backgroundUrl.length > 0 ? venue.backgroundUrl : [venue.logoUrl || defaultImage];

  useEffect(() => {
    console.log('Media:', media); // media 배열이 올바르게 설정되었는지 확인
    console.log('Venue:', venue); // venue 객체가 올바르게 전달되었는지 확인

    // 초기 좋아요 상태 설정
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
    await handleHeartClick(e, venue.venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast(<CustomToast>링크가 복사되었어요!</CustomToast>, {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
      const video = document.querySelector<HTMLVideoElement>(`.slick-slide[data-index="${current}"] video`);
      if (video) {
        video.play();
      }
    },
  };

  return (
    <div className="relative flex h-[17.5rem] w-full flex-col justify-between">
      <StyledToastContainer />
      <div className="absolute z-20 flex w-full items-start justify-between px-[1rem] py-[1rem]">
        <button onClick={() => router.back()} aria-label="뒤로가기" className="text-white">
          <Image src="/icons/ArrowLeft.svg" alt="back icon" width={24} height={24} />
        </button>
        <div className="flex items-center space-x-[1.25rem]">
          <div onClick={handleShareClick} className="cursor-pointer">
            <Image src="/icons/share.svg" alt="share icon" width={32} height={32} />
          </div>
          <div onClick={handleHeartClickWrapper} className="cursor-pointer">
            <Image
              src={likedClubs[venue.venueId] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
              alt="heart icon"
              width={32}
              height={32}
            />
          </div>
        </div>
      </div>
      <Slider ref={sliderRef} {...settings} className="absolute inset-0 z-10 h-full w-full">
        {media.map((url, index) => (
          <div key={index} className="relative h-[17.5rem] w-full">
            {url.match(/\.(jpeg|jpg|gif|png|heic|jfif)$/i) ? (
              <Image src={url} alt={`Background ${index}`} fill className="object-cover object-center" />
            ) : url.match(/\.mp4$/i) ? (
              <video key={`video-${index}`} className="h-full w-full object-cover" controls muted loop>
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                key={`default-${index}`}
                src={defaultImage}
                alt="Default Image"
                layout="fill"
                className="object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
          </div>
        ))}
      </Slider>
      <div className="absolute bottom-0 z-20 flex flex-col items-start gap-[1rem] px-[1rem] py-[1.25rem] text-white">
        <h1 className="text-title-24-bold">{venue.englishName}</h1>
        <div className="flex w-4/5 flex-wrap gap-2">
          {tagList && tagList.length > 0 ? (
            tagList.map((tag: string, index: number) => (
              <span
                key={index}
                className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-body3-12-medium text-gray100">No tags available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { formatRelativeTime } from './BoardThread';

interface BoardImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  isReview?: boolean;
  clubName?: string;
  reviewInfo?: {
    nickname: string;
    profileImageUrl?: string;
    content: string;
    createdAt: string;
    likes: number;
    liked: boolean;
    venueReviewId: string;
  };
  onLikeToggle?: (reviewId: string) => void;
}

// 파일 확장자로 이미지/영상 구분
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

export default function BoardImageModal({
  images,
  initialIndex,
  onClose,
  isReview = false,
  clubName,
  reviewInfo,
  onLikeToggle,
}: BoardImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // 모달 내부 좋아요 상태 (낙관적 업데이트용)
  const [localLiked, setLocalLiked] = useState(reviewInfo?.liked || false);
  const [localLikes, setLocalLikes] = useState(reviewInfo?.likes || 0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'm' || e.key === 'M') {
        // M 키로 음소거 토글
        handleMuteToggle();
      } else if (e.key === 'AudioVolumeMute' || e.key === 'F1' || e.key === 'F10') {
        // 시스템 음소거 키 (Fn + F1, F10 등)
        handleMuteToggle();
      } else if (e.key === 'F8' && e.ctrlKey) {
        // Ctrl + F8 (일부 키보드)
        handleMuteToggle();
      }
    },
    [images.length, onClose],
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (Math.abs(deltaX) > 50) {
        // 좌우 스와이프
        if (deltaX > 50) {
          setCurrentIndex((prev) => (prev + 1) % images.length);
        } else if (deltaX < -50) {
          setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      console.log('음소거 상태 변경:', newMutedState); // 디버깅용
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // 실제 영상의 음소거 상태와 앱 상태 동기화
      if (videoRef.current.muted !== isMuted) {
        setIsMuted(videoRef.current.muted);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      // 기본적으로 음소거 상태로 설정하되, 시스템 볼륨이 0이 아닌 경우 음소거 해제
      const shouldStartMuted = true; // 기본값은 음소거
      videoRef.current.muted = shouldStartMuted;
      setIsMuted(shouldStartMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 영상의 음소거 상태 변경 감지
  const handleVolumeChange = () => {
    if (videoRef.current) {
      const isCurrentlyMuted = videoRef.current.muted || videoRef.current.volume === 0;
      setIsMuted(isCurrentlyMuted);
      console.log('볼륨 변경 감지:', { muted: videoRef.current.muted, volume: videoRef.current.volume });
    }
  };

  // 사진첩에 다운로드하는 함수
  const handleDownload = async (url: string) => {
    try {
      // 모바일 환경인지 확인
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // 모바일에서만 사진첩에 저장 시도
        const urlParts = url.split('.');
        const extension = urlParts[urlParts.length - 1]?.split('?')[0] || 'jpg';
        const filename = `beatbuddy_${Date.now()}.${extension}`;

        // fetch로 이미지 데이터 가져오기
        const response = await fetch(url);
        const blob = await response.blob();

        // Web Share API 사용 (iOS 12.3+, Android Chrome 75+)
        if ('share' in navigator && navigator.canShare) {
          const file = new File([blob], filename, { type: blob.type });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'BeatBuddy 이미지',
              text: 'BeatBuddy에서 다운로드한 이미지입니다.',
            });
            return;
          }
        }

        // Web Share API를 지원하지 않는 경우 Blob URL로 다운로드
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        alert('다운로드가 완료되었습니다. 사진첩을 확인해주세요.');
      } else {
        // 데스크톱에서는 기존 방식으로 다운로드
        const link = document.createElement('a');
        link.href = url;
        link.download = `beatbuddy_${Date.now()}.jpg`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 영상 재생 시작 시 볼륨 상태 확인
  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      // 재생 시작 시 실제 볼륨 상태 확인
      setTimeout(() => {
        if (videoRef.current) {
          const isCurrentlyMuted = videoRef.current.muted || videoRef.current.volume === 0;
          setIsMuted(isCurrentlyMuted);
          console.log('재생 시작 시 볼륨 상태:', { muted: videoRef.current.muted, volume: videoRef.current.volume });
        }
      }, 100);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown, handleClickOutside]);

  // 영상이 변경될 때마다 재생 상태 초기화
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsMuted(true);
  }, [currentIndex]);

  // reviewInfo가 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    if (reviewInfo) {
      setLocalLiked(reviewInfo.liked);
      setLocalLikes(reviewInfo.likes);
    }
  }, [reviewInfo]);

  if (typeof window === 'undefined') return null;

  const currentUrl = images[currentIndex];
  const isCurrentVideo = isVideo(currentUrl);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-BG-black">
      <div
        className="relative flex h-full w-full flex-col items-center justify-center"
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        {/* 상단 헤더 */}
        <div className="absolute left-0 right-0 top-0 z-10 flex w-full items-center justify-between py-[0.53rem] pl-[0.62rem] pr-4">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center justify-center rounded-full" title="뒤로가기">
              <Image
                src="/icons/line-md_chevron-left.svg"
                alt="뒤로가기"
                width={35}
                height={35}
                className="text-white"
              />
            </button>

            {isReview && <span className="text-[1.5rem] font-bold text-white">{clubName}</span>}
          </div>

          {isReview ? (
            // 리뷰용 헤더: 인덱스만 오른쪽에
            <div className="px-3 py-1 text-[0.8125rem] text-gray200">
              <span className="text-main">{currentIndex + 1}</span>
              <span className="text-gray200"> / </span>
              <span className="text-gray200">{images.length}</span>
            </div>
          ) : (
            // 게시판용 헤더: 사진 인덱스만
            <div className="px-3 py-1 text-[0.8125rem] text-gray200">
              <span className="text-main">{currentIndex + 1}</span>
              <span className="text-gray200"> / </span>
              <span className="text-gray200">{images.length}</span>
            </div>
          )}

          {!isReview && (
            <button
              onClick={() => handleDownload(currentUrl)}
              className="flex items-center justify-center"
              title="사진첩에 저장">
              <Image src="/icons/사진/Vector.svg" alt="다운로드" width={20} height={20} className="text-white" />
            </button>
          )}
        </div>

        {/* 이미지 또는 영상 */}
        <div className="relative flex h-full w-full items-center justify-center">
          {isCurrentVideo ? (
            <div className="relative flex h-full w-full items-center justify-center">
              <video
                ref={videoRef}
                src={currentUrl}
                className="h-auto w-full object-cover [&::-webkit-media-controls-current-time-display]:!hidden [&::-webkit-media-controls-fullscreen-button]:!hidden [&::-webkit-media-controls-mute-button]:!hidden [&::-webkit-media-controls-panel]:!hidden [&::-webkit-media-controls-play-button]:!hidden [&::-webkit-media-controls-return-to-realtime-button]:!hidden [&::-webkit-media-controls-rewind-button]:!hidden [&::-webkit-media-controls-seek-back-button]:!hidden [&::-webkit-media-controls-seek-forward-button]:!hidden [&::-webkit-media-controls-start-playback-button]:!hidden [&::-webkit-media-controls-time-remaining-display]:!hidden [&::-webkit-media-controls-timeline]:!hidden [&::-webkit-media-controls-volume-slider]:!hidden [&::-webkit-media-controls]:!hidden"
                preload="metadata"
                muted={isMuted}
                playsInline
                webkit-playsinline="true"
                x5-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="false"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onVolumeChange={handleVolumeChange}
                style={{
                  pointerEvents: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
              />

              {/* 커스텀 재생/일시정지 버튼 */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30"
                  title="재생">
                  <Image src="/icons/play.svg" alt="재생" width={80} height={80} className="opacity-80" />
                </button>
              )}

              {/* 커스텀 컨트롤 */}
              {(!isReview || !reviewInfo || isPlaying) && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
                  onClick={(e) => e.stopPropagation()}>
                  {/* 재생/일시정지 버튼과 진행바 */}
                  <div className="flex items-center gap-3">
                    {/* 재생/일시정지 버튼 */}
                    <button
                      onClick={handlePlayPause}
                      className="flex items-center justify-center rounded-full"
                      title={isPlaying ? '일시정지' : '재생'}>
                      <Image
                        src={isPlaying ? '/icons/pause.svg' : '/icons/play.svg'}
                        alt={isPlaying ? '일시정지' : '재생'}
                        width={24}
                        height={24}
                        className="text-white"
                      />
                    </button>

                    {/* 진행바 */}
                    <div className="flex flex-1 items-center gap-2">
                      <span className="text-xs text-white">
                        {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/25"
                        style={{
                          background: `linear-gradient(to right, #EE1171 0%, #EE1171 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.25) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.25) 100%)`,
                        }}
                      />
                      <span className="text-xs text-white">
                        {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')}
                      </span>
                    </div>

                    {/* 음소거/음소거해제 버튼 */}
                    <button
                      onClick={handleMuteToggle}
                      className="flex items-center justify-center p-2 transition-all hover:bg-opacity-30"
                      title={isMuted ? '음소거 해제' : '음소거'}>
                      <Image
                        src={isMuted ? '/icons/speaker-muted.svg' : '/icons/speaker.svg'}
                        alt={isMuted ? '음소거 해제' : '음소거'}
                        width={24}
                        height={24}
                        className="text-white"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Image
              src={currentUrl}
              alt={`modal-img-${currentIndex}`}
              width={1000}
              height={1000}
              className="h-auto max-h-[31.25rem] w-full object-cover"
            />
          )}

          {/* 좌우 화살표 네비게이션 */}
          {images.length > 1 && (
            <>
              {/* 왼쪽 화살표 */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center"
                title="이전">
                <Image src="/icons/line-md_chevron-left.svg" alt="이전" width={24} height={24} className="text-white" />
              </button>

              {/* 오른쪽 화살표 */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                className="absolute right-4 top-1/2 flex -translate-y-1/2 rotate-180 items-center justify-center"
                title="다음">
                <Image src="/icons/line-md_chevron-left.svg" alt="다음" width={24} height={24} className="text-white" />
              </button>
            </>
          )}
        </div>

        {/* 리뷰 정보 (하단) - 동영상이 멈춰있을 때만 표시 */}
        {isReview && reviewInfo && (!isCurrentVideo || !isPlaying) && (
          <div className="absolute bottom-0 left-0 right-0 z-10 px-5 py-[0.88rem]">
            <div className="flex flex-col">
              <div className="flex items-start">
                <Image
                  src={reviewInfo.profileImageUrl || '/icons/default-avatar.svg'}
                  alt={`${reviewInfo.nickname}의 프로필 사진`}
                  className="mr-[0.62rem] h-8 w-8 rounded-full object-cover"
                  width={32}
                  height={32}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[0.875rem] font-bold text-white">{reviewInfo.nickname}</p>
                  </div>
                  <p className="text-[0.75rem] text-gray200">{formatRelativeTime(reviewInfo.createdAt)}</p>
                </div>
              </div>
              <p className="mt-[0.88rem] text-[0.8125rem] text-gray100">{reviewInfo.content}</p>
              {/* 좋아요 버튼 - 내용 아래 우측에 배치 */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (onLikeToggle && reviewInfo) {
                      // 낙관적 업데이트
                      const newLiked = !localLiked;
                      const newLikes = newLiked ? localLikes + 1 : localLikes - 1;
                      setLocalLiked(newLiked);
                      setLocalLikes(newLikes);

                      // 실제 API 호출
                      onLikeToggle(reviewInfo.venueReviewId);
                    }
                  }}
                  className={`flex items-center gap-1 ${localLiked ? 'text-main' : 'text-gray300'}`}>
                  <Image
                    src={localLiked ? '/icons/thumb-up-clicked.svg' : '/icons/thumb-up.svg'}
                    alt="좋아요"
                    width={17}
                    height={17}
                  />
                  <span className="text-[0.75rem]">{localLikes}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

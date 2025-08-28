'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { formatRelativeTime } from './BoardThread';
import { motion, AnimatePresence } from 'framer-motion';

// ================= WebView message types =================
const WEBVIEW_MESSAGE_TYPE = {
  IMAGE_DOWNLOAD_SUCCESS: 'IMAGE_DOWNLOAD_SUCCESS',
  IMAGE_DOWNLOAD_FAILED: 'IMAGE_DOWNLOAD_FAILED',
  IMAGE_DOWNLOAD_REQUEST: 'IMAGE_DOWNLOAD_REQUEST',
} as const;

type WebviewMessageTypeKey = keyof typeof WEBVIEW_MESSAGE_TYPE;

interface PostMessageObjectInterface {
  type: (typeof WEBVIEW_MESSAGE_TYPE)[WebviewMessageTypeKey];
  data: unknown;
  [key: string]: unknown;
}

function getStringPostMessageObject(object: PostMessageObjectInterface) {
  return JSON.stringify(object);
}

// ================= Types =================
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

// ================= Helpers for web save =================
const guessExtAndMime = (url: string, blob?: Blob) => {
  if (blob?.type) return { ext: blob.type.split('/')[1] || 'jpg', mime: blob.type };
  const m = url.toLowerCase().match(/\.(jpe?g|png|webp|gif|heic|bmp)(\?|#|$)/);
  const ext = m?.[1] || 'jpg';
  const mime =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : ext === 'gif'
            ? 'image/gif'
            : ext === 'heic'
              ? 'image/heic'
              : 'image/*';
  return { ext, mime };
};

const canShareFiles = (files: File[]) =>
  typeof (navigator as any).canShare === 'function' && (navigator as any).canShare({ files });

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
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [showArrows, setShowArrows] = useState(true);
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
        setSlideDirection('right');
        setShowArrows(true);
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setSlideDirection('left');
        setShowArrows(true);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'm' || e.key === 'M') {
        handleMuteToggle();
      } else if (e.key === 'AudioVolumeMute' || e.key === 'F10') {
        handleMuteToggle();
      } else if (e.key === 'F8' && e.ctrlKey) {
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
        if (deltaX > 50) {
          setSlideDirection('right');
          setShowArrows(true);
          setCurrentIndex((prev) => (prev + 1) % images.length);
        } else if (deltaX < -50) {
          setSlideDirection('left');
          setShowArrows(true);
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
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.muted !== isMuted) {
        setIsMuted(videoRef.current.muted);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
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

  const handleVolumeChange = () => {
    if (videoRef.current) {
      const isCurrentlyMuted = videoRef.current.muted || videoRef.current.volume === 0;
      setIsMuted(isCurrentlyMuted);
    }
  };

  const handleImageClick = () => {
    setShowArrows(!showArrows);
  };

  // =============== Web ↔ WebView bridge (receive) ===============
  const handleWebViewMessage = useCallback((event: MessageEvent) => {
    try {
      const { type, data } = JSON.parse(event.data as string);
      switch (type) {
        case WEBVIEW_MESSAGE_TYPE.IMAGE_DOWNLOAD_SUCCESS:
          // TODO: 프로젝트의 Toast로 교체
          // eslint-disable-next-line no-console
          console.log('이미지 다운로드 성공:', data);
          break;
        case WEBVIEW_MESSAGE_TYPE.IMAGE_DOWNLOAD_FAILED:
          // eslint-disable-next-line no-console
          console.error('이미지 다운로드 실패:', data);
          break;
        default:
          // eslint-disable-next-line no-console
          console.log('알 수 없는 웹뷰 메시지 타입:', type);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('웹뷰 메시지 파싱 실패:', error);
    }
  }, []);

  // =============== 다운로드: 모바일/데스크톱 분기 ===============
  const handleDownload = async (url: string) => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      await downloadImageWhenMobile(url);
    } else {
      await downloadImageWhenNotMobile(url);
    }
  };

  // 모바일 환경: (1) WebView 브릿지 우선 → (2) 모바일 웹은 Web Share API → (3) 폴백 새 탭
  const downloadImageWhenMobile = async (url: string) => {
    // (0) 네이티브 WebView 브릿지가 있다면 네이티브 저장
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(
        getStringPostMessageObject({
          type: WEBVIEW_MESSAGE_TYPE.IMAGE_DOWNLOAD_REQUEST,
          data: { imageData: url, filename: `beatbuddy_${Date.now()}`, originalUrl: url },
        }),
      );
      return;
    }

    // (1) 모바일 웹: Web Share API로 파일 공유 → 사진첩 저장 유도
    try {
      const resp = await fetch(url, { cache: 'no-cache' }); // 캐시로 CORS 꼬임 방지
      const blob = await resp.blob();
      const { ext, mime } = guessExtAndMime(url, blob);
      const file = new File([blob], `beatbuddy_${Date.now()}.${ext}`, { type: mime });

      if (canShareFiles([file])) {
        await (navigator as any).share({
          files: [file],
          title: 'BeatBuddy',
          text: 'BeatBuddy에서 저장한 이미지',
        });
        return;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Web Share(파일) 시도 실패:', e);
    }

    // (2) 폴백: 새 탭으로 열어 길게 눌러 저장하도록 안내
    fallbackToNewTab(url);
  };

  // 데스크톱: a[download] 기본 다운로드
  const downloadImageWhenNotMobile = async (url: string) => {
    try {
      const { ext } = guessExtAndMime(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = `beatbuddy_${Date.now()}.${ext}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('데스크톱 다운로드 실패:', error);
      alert('다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 최종 폴백: 새 탭에서 이미지 열기
  const fallbackToNewTab = (imageUrl: string) => {
    const newWindow = window.open(imageUrl, '_blank');
    if (newWindow) {
      setTimeout(() => {
        try {
          newWindow.close();
        } catch (_) {
          // noop
        }
      }, 1000);
    } else {
      alert('팝업이 차단되었습니다. 이미지를 길게 눌러 "사진에 저장"을 선택해주세요.');
    }
  };

  // 영상 재생 시작 시 볼륨 상태 확인
  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      setTimeout(() => {
        if (videoRef.current) {
          const isCurrentlyMuted = videoRef.current.muted || videoRef.current.volume === 0;
          setIsMuted(isCurrentlyMuted);
        }
      }, 100);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';

    window.addEventListener('message', handleWebViewMessage);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
      window.removeEventListener('message', handleWebViewMessage);
    };
  }, [handleKeyDown, handleClickOutside, handleWebViewMessage]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsMuted(true);
  }, [currentIndex]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-BG-black" onClick={onClose}>
      <div
        className="relative flex h-full w-full flex-col items-center justify-center"
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 */}
        <div className="absolute left-0 right-0 top-0 z-10 flex w-full items-center justify-between px-5 py-[0.8rem]">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex items-center justify-center rounded-full" title="뒤로가기">
              <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} className="text-white" />
            </button>

            {isReview && <span className="text-title-24-bold text-white">{clubName}</span>}
          </div>

          {/* 인덱스 */}
          <div className="px-3 py-1 text-body-13-medium text-gray200">
            <span className="text-main">{currentIndex + 1}</span>
            <span className="text-gray200"> / </span>
            <span className="text-gray200">{images.length}</span>
          </div>

          {/* 다운로드 버튼 (리뷰 화면이 아닐 때만) */}
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
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <motion.div
            key={`${currentIndex}-${slideDirection}`}
            initial={{
              opacity: 0,
              x: slideDirection === 'right' ? 100 : -100,
            }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
              type: 'tween',
            }}
            className="relative flex h-full w-full items-center justify-center">
            {isCurrentVideo ? (
              <div className="relative flex h-full w-full items-center justify-center" onClick={handleImageClick}>
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
                        <span className="text-body-10-medium text-white">
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
                        <span className="text-body-10-medium text-white">
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
              <div
                onClick={handleImageClick}
                className="relative flex h-full w-full cursor-pointer items-center justify-center">
                <Image src={currentUrl} alt={`modal-img-${currentIndex}`} fill className="object-contain" />
              </div>
            )}
          </motion.div>

          {/* 좌우 화살표 네비게이션 */}
          {images.length > 1 && showArrows && (
            <>
              <AnimatePresence mode="wait">
                <motion.button
                  key={`left-${currentIndex}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onClick={() => {
                    setSlideDirection('left');
                    setShowArrows(true);
                    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
                  }}
                  className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-center"
                  title="이전">
                  <Image
                    src="/icons/line-md_chevron-left.svg"
                    alt="이전"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </motion.button>

                <motion.button
                  key={`right-${currentIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  onClick={() => {
                    setSlideDirection('right');
                    setShowArrows(true);
                    setCurrentIndex((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center"
                  title="다음">
                  <Image
                    src="/사진/line-md_chevron-left.svg"
                    alt="다음"
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </motion.button>
              </AnimatePresence>
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
                    <p className="text-body-14-bold text-white">{reviewInfo.nickname}</p>
                  </div>
                  <p className="text-body3-12-medium text-gray200">{formatRelativeTime(reviewInfo.createdAt)}</p>
                </div>
              </div>
              <p className="mt-[0.88rem] text-body-13-medium text-gray100">{reviewInfo.content}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (onLikeToggle && reviewInfo) {
                      const newLiked = !localLiked;
                      const newLikes = newLiked ? localLikes + 1 : localLikes - 1;
                      setLocalLiked(newLiked);
                      setLocalLikes(newLikes);
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
                  <span className="text-body3-12-medium">{localLikes}</span>
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

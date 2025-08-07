'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface BoardImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

// 파일 확장자로 이미지/영상 구분
const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowerUrl.includes(ext));
};

export default function BoardImageModal({ images, initialIndex, onClose }: BoardImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

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
      if (deltaX > 50) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (deltaX < -50) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
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
          <button onClick={onClose} className="flex items-center justify-center rounded-full" title="뒤로가기">
            <Image src="/icons/line-md_chevron-left.svg" alt="뒤로가기" width={35} height={35} className="text-white" />
          </button>

          <div className="px-3 py-1 text-[0.8125rem] text-gray200">
            <span className="text-main">{currentIndex + 1}</span>
            <span className="text-gray200"> / </span>
            <span className="text-gray200">{images.length}</span>
          </div>

          <a href={currentUrl} download className="flex items-center justify-center">
            <Image src="/icons/사진/Vector.svg" alt="다운로드" width={20} height={20} className="text-white" />
          </a>
        </div>

        {/* 이미지 또는 영상 */}
        <div className="relative flex h-full w-full items-center justify-center">
          {isCurrentVideo ? (
            <div className="relative flex h-full w-full items-center justify-center">
              <video
                ref={videoRef}
                src={currentUrl}
                className="h-auto max-h-full w-full object-contain"
                preload="metadata"
                muted={true}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onVolumeChange={handleVolumeChange}
              />

              {/* 커스텀 컨트롤 */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* 재생/일시정지 버튼과 진행바 */}
                <div className="flex items-center gap-3">
                  {/* 재생/일시정지 버튼 */}
                  <button
                    onClick={handlePlayPause}
                    className="flex items-center justify-center "
                    title={isPlaying ? '일시정지' : '재생'}>
                    <Image
                      src={isPlaying ? '/icons/pause.svg' : '/icons/play.svg'}
                      alt={isPlaying ? '일시정지' : '재생'}
                      width={30}
                      height={30}
                    />
                  </button>

                  {/* 진행바 */}
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="h-2 flex-1 cursor-pointer appearance-none bg-white/25"
                      style={{
                        background: `linear-gradient(to right, #EE1171 0%, #EE1171 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.25) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.25) 100%)`,
                      }}
                    />
                  </div>

                  {/* 음소거/음소거해제 버튼 */}
                  <button
                    onClick={handleMuteToggle}
                    className="flex items-center justify-center transition-all hover:bg-opacity-30"
                    title={isMuted ? '음소거 해제' : '음소거'}>
                    <Image
                      src={isMuted ? '/icons/speaker-muted.svg' : '/icons/speaker.svg'}
                      alt={isMuted ? '음소거 해제' : '음소거'}
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Image
              src={currentUrl}
              alt={`modal-img-${currentIndex}`}
              width={1000}
              height={1000}
              className="h-auto max-h-full w-full object-contain"
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
      </div>
    </div>,
    document.body,
  );
}

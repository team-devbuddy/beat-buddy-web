'use client';

import React, { ChangeEvent, useMemo, useCallback, useState } from 'react';
import Image from 'next/image'; // Next.js Image import

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  uploadedFiles: File[];
  existingImages?: string[]; // 수정 모드일 때 기존 이미지 URL들
}

const ImageUploader = React.memo(({ onUpload, uploadedFiles, existingImages = [] }: ImageUploaderProps) => {
  // 파일 크기 초과 상태 관리
  const [sizeExceeded, setSizeExceeded] = useState(false);
  // 에러 메시지 상태 관리
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 파일 URL을 메모이제이션
  const fileUrls = useMemo(() => {
    return uploadedFiles.map((file) => URL.createObjectURL(file));
  }, [uploadedFiles]);

  // HEIC 파일을 JPEG로 변환하는 함수
  const convertHeicToJpeg = useCallback(async (file: File): Promise<File> => {
    try {
      // heic2any를 동적 import로 사용
      const heic2any = (await import('heic2any')).default;

      // heic2any를 사용하여 HEIC를 JPEG로 변환
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });

      // Blob을 File 객체로 변환 (배열인 경우 첫 번째 요소 사용)
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      const jpegFile = new File([blob], file.name.replace(/\.(heic|HEIC)$/i, '.jpg'), {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });

      return jpegFile;
    } catch (error) {
      console.error('HEIC 변환 실패:', error);
      // 변환 실패 시 원본 파일 반환
      return file;
    }
  }, []);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selected = Array.from(e.target.files);

        // 파일 크기 검증 (10MB 제한)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = selected.filter((file) => file.size > MAX_FILE_SIZE);

        if (oversizedFiles.length > 0) {
          setErrorMessage('파일 1개의 최대 크기는 10MB입니다');
          return;
        }

        // 전체 요청 크기 검증 (30MB 제한)
        const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
        const currentTotalSize = uploadedFiles.reduce((total, file) => total + file.size, 0);
        const newFilesTotalSize = selected.reduce((total, file) => total + file.size, 0);

        if (currentTotalSize + newFilesTotalSize > MAX_TOTAL_SIZE) {
          setSizeExceeded(true);
          setErrorMessage('전체 요청 크기는 30MB를 초과할 수 없습니다');
          return;
        } else {
          setSizeExceeded(false);
          setErrorMessage(''); // 에러 메시지 제거
        }

        // HEIC 파일을 JPEG로 변환
        const processedFiles = await Promise.all(
          selected.map(async (file) => {
            if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
              return await convertHeicToJpeg(file);
            }
            return file;
          }),
        );

        // 최대 20개까지만 유지
        if (uploadedFiles.length + processedFiles.length > 20) {
          const remainingSlots = 20 - uploadedFiles.length;
          const filesToAdd = processedFiles.slice(0, remainingSlots);
          const nextFiles = [...uploadedFiles, ...filesToAdd];
          onUpload(nextFiles);
          return;
        }
        const nextFiles = [...uploadedFiles, ...processedFiles];
        onUpload(nextFiles);
      }
    },
    [uploadedFiles, onUpload, convertHeicToJpeg],
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
      onUpload(updatedFiles);

      // 파일 제거 후 크기 초과 상태 재확인
      const totalSize = updatedFiles.reduce((total, file) => total + file.size, 0);
      const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
      const isExceeded = totalSize > MAX_TOTAL_SIZE;
      setSizeExceeded(isExceeded);

      // 크기가 정상이 되면 에러 메시지 제거
      if (!isExceeded) {
        setErrorMessage('');
      }
    },
    [uploadedFiles, onUpload],
  );

  // 파일이 이미지인지 영상인지 확인하는 함수
  const isVideo = useCallback((file: File) => {
    return file.type.startsWith('video/');
  }, []);

  // 파일이 이미지인지 확인하는 함수
  const isImage = useCallback((file: File) => {
    return file.type.startsWith('image/');
  }, []);

  // 컴포넌트 언마운트 시 URL 정리
  React.useEffect(() => {
    return () => {
      fileUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [fileUrls]);

  return (
    <div className="relative px-5">
      {uploadedFiles.length === 0 && existingImages.length === 0 ? (
        // 초기 UI: 파일이 없는 상태
        <div className="mt-[0.88rem] rounded-[0.5rem] bg-gray600 py-[3.91rem]">
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center text-gray100">
            <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={48} height={48} />
            <span className="text-body-14-medium text-gray100">사진이나 영상을 추가해주세요</span>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*,.heic,.HEIC"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        // 파일 업로드 이후 UI 또는 기존 이미지가 있는 경우
        <div className="no-scrollbar mt-[0.88rem] flex items-center space-x-4 overflow-x-scroll">
          {/* 기존 이미지들 (수정 모드) */}
          {existingImages.map((imageUrl, index) => (
            <div
              key={`existing-${index}`}
              className="relative h-[12.5rem] w-[12.5rem] flex-shrink-0 rounded-[0.25rem] bg-[#17181C]/70">
              <Image
                src={imageUrl}
                alt={`Existing ${index}`}
                fill
                sizes="12.5rem"
                className="rounded-[0.25rem] object-cover"
              />
              {/* 기존 이미지는 삭제 불가 (순번만 표시) */}
              <div className="absolute left-[0.62rem] top-[0.62rem] rounded-[0.5rem] bg-black/70 px-2 py-[0.19rem] text-body-11-medium text-gray200">
                {index + 1}/{existingImages.length + uploadedFiles.length}
              </div>
            </div>
          ))}

          {/* 업로드된 파일들 */}
          {uploadedFiles.map((file, index) => (
            <div
              key={`uploaded-${index}`}
              className="relative h-[12.5rem] w-[12.5rem] flex-shrink-0 rounded-[0.25rem] bg-[#17181C]/70">
              {/* 이미지인 경우 */}
              {isImage(file) && (
                <Image
                  src={fileUrls[index]}
                  alt={`Uploaded ${index}`}
                  fill
                  sizes="12.5rem"
                  className="rounded-[0.25rem] object-cover"
                />
              )}
              {/* 영상인 경우 */}
              {isVideo(file) && (
                <div className="relative h-full w-full">
                  <video
                    src={fileUrls[index]}
                    className="h-full w-full rounded-[0.25rem] object-cover"
                    preload="metadata"
                    muted
                  />
                  {/* 영상 재생 아이콘 오버레이 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <Image src="/icons/play.svg" alt="재생" width={48} height={48} className="text-white" />
                  </div>
                </div>
              )}
              {/* 삭제 버튼 */}
              <div
                onClick={() => handleRemoveFile(index)}
                className="absolute right-[0.62rem] top-[0.62rem] cursor-pointer">
                <Image src="/icons/x-square-contained.svg" alt="Remove Icon" width={24} height={24} className="" />
              </div>
              {/* 순번 라벨 */}
              <div className="absolute left-[0.62rem] top-[0.62rem] rounded-[0.5rem] bg-black/70 px-2 py-[0.19rem] text-body-11-medium text-gray200">
                {existingImages.length + index + 1}/{existingImages.length + uploadedFiles.length}
              </div>
            </div>
          ))}

          {/* 업로더 박스 */}
          {existingImages.length + uploadedFiles.length < 20 && (
            <div className="relative h-[12.5rem] w-[12.5rem] flex-shrink-0 rounded-[0.25rem] bg-gray500">
              <label
                htmlFor="file-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-body-14-medium text-gray100">
                <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={32} height={32} />
                <span>추가</span>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,video/*,.heic,.HEIC"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      )}

      {/* 업로드 제한 안내 */}
      {existingImages.length + uploadedFiles.length >= 20 && (
        <p className="mt-2 text-start text-body3-12-medium text-main">최대 20장까지만 업로드 가능합니다</p>
      )}

      {/* 에러 메시지 */}
      {errorMessage && <p className="mt-2 text-start text-body3-12-medium text-main">{errorMessage}</p>}
    </div>
  );
});

export default ImageUploader;

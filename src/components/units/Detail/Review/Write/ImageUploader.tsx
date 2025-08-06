'use client';

import React, { ChangeEvent } from 'react';
import Image from 'next/image'; // Next.js Image import
import heic2any from 'heic2any';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  uploadedFiles: File[];
}

const ImageUploader = ({ onUpload, uploadedFiles }: ImageUploaderProps) => {
  // HEIC 파일을 JPEG로 변환하는 함수
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
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
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);

      

      // HEIC 파일을 JPEG로 변환
      const processedFiles = await Promise.all(
        selected.map(async (file) => {
          if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
            return await convertHeicToJpeg(file);
          }
          return file;
        }),
      );

      // 최대 5개까지만 유지
      const nextFiles = [...uploadedFiles, ...processedFiles].slice(0, 5);
      onUpload(nextFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    onUpload(updatedFiles);
  };

  // 파일이 이미지인지 영상인지 확인하는 함수
  const isVideo = (file: File) => {
    return file.type.startsWith('video/');
  };

  // 파일이 이미지인지 확인하는 함수
  const isImage = (file: File) => {
    return file.type.startsWith('image/');
  };

  return (
    <div className="relative px-5">
      {uploadedFiles.length === 0 ? (
        // 초기 UI: 파일이 없는 상태
        <div className="mt-[0.88rem] rounded-[0.5rem] bg-gray600 py-[3.91rem]">
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center text-gray100">
            <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={48} height={48} />
            <span className="text-[0.875rem] text-gray100">사진이나 영상을 추가해주세요.</span>
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
        // 파일 업로드 이후 UI
        <div className="no-scrollbar mt-[0.88rem] flex items-center space-x-4 overflow-x-scroll">
          {/* 업로드된 파일들 */}
          {uploadedFiles.map((file, index) => (
            <div key={index} className="relative h-[12.5rem] w-[13.0625rem] flex-shrink-0 rounded-[0.25rem] bg-gray500">
              {/* 이미지인 경우 */}
              {isImage(file) && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-[0.25rem]"
                />
              )}
              {/* 영상인 경우 */}
              {isVideo(file) && (
                <video
                  src={URL.createObjectURL(file)}
                  className="h-full w-full rounded-[0.25rem] object-cover"
                  controls
                  muted
                  style={{ objectFit: 'cover' }}
                />
              )}
              {/* 삭제 버튼 */}
              <div onClick={() => handleRemoveFile(index)} className="absolute right-[0.62rem] top-[0.62rem]">
                <Image src="/icons/x-square-contained.svg" alt="Remove Icon" width={23} height={23} />
              </div>
              {/* 순번 라벨 */}
              <div className="absolute left-[0.62rem] top-[0.62rem] rounded-[0.5rem] bg-BG-black/70 px-[0.5rem] py-[0.12rem] text-[0.625rem] text-white">
                {index + 1}/{uploadedFiles.length}
              </div>
              
            </div>
          ))}
          {/* 업로더 박스 */}
          {uploadedFiles.length < 5 && (
            <div className="relative h-[12.5rem] w-[13.0625rem] flex-shrink-0 rounded-[0.25rem] border border-dashed border-gray300 bg-gray500">
              <label
                htmlFor="file-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray100">
                <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={48} height={48} />
                <span className="text-[0.875rem] text-gray100">추가</span>
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
      {uploadedFiles.length >= 5 && (
        <p className="mt-2 text-start text-[0.75rem] text-main">최대 5개까지만 업로드 가능합니다.</p>
      )}
    </div>
  );
};

export default ImageUploader;

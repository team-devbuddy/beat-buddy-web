'use client';

import React, { ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUpload: (images: File[]) => void;
  uploadedImages: File[];
  existingImages?: string[]; // 기존 이미지 URL 배열 추가
}

const ImageUploader = ({ onUpload, uploadedImages, existingImages = [] }: ImageUploaderProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);

      if (uploadedImages.length + fileArray.length > 20) {
        return;
      }

      onUpload([...uploadedImages, ...fileArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    onUpload(updatedImages);
  };

  return (
    <div className="relative px-5">
      {uploadedImages.length === 0 && existingImages.length === 0 ? (
        <div className="mt-5 rounded-[0.5rem] bg-gray600 py-[3.94rem]">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center text-gray100">
            <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={48} height={48} />
            <span className="mt-[0.38rem] text-body-14-medium text-gray100">포스터 및 사진을 추가해주세요</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      ) : (
        <div className="no-scrollbar mt-7 flex items-center space-x-2 overflow-x-scroll">
          {/* 기존 이미지들 표시 */}
          {existingImages.map((imageUrl, index) => (
            <div
              key={`existing-${index}`}
              className="relative h-[12.5rem] w-[12.5rem] flex-shrink-0 rounded-xs bg-gray500">
              <Image src={imageUrl} alt={`Existing ${index}`} layout="fill" objectFit="cover" className="rounded-xs" />
              <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                {index + 1}/{existingImages.length + uploadedImages.length}
              </div>
            </div>
          ))}

          {/* 업로드된 이미지들 표시 */}
          {uploadedImages.map((image, index) => (
            <div
              key={`uploaded-${index}`}
              className="relative h-[12.5rem] w-[12.5rem] flex-shrink-0 rounded-[0.25rem] bg-[#17181C]/70">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-[0.25rem]"
              />
              <div
                onClick={() => handleRemoveImage(index)}
                className="absolute right-[0.62rem] top-[0.62rem] cursor-pointer">
                <Image src="/icons/x-square-contained.svg" alt="Remove Icon" width={24} height={24} className="" />
              </div>
              <div className="absolute left-[0.62rem] top-[0.62rem] rounded-[0.5rem] bg-black/70 px-2 py-[0.19rem] text-body-11-medium text-gray200">
                {existingImages.length + index + 1}/{existingImages.length + uploadedImages.length}
              </div>
            </div>
          ))}

          {existingImages.length + uploadedImages.length < 20 && (
            <div className="relative h-[12.5rem] w-[12.5rem] flex-shrink-0 rounded-[0.25rem] bg-gray500">
              <label
                htmlFor="image-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-body-14-medium text-gray100">
                <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={32} height={32} />
                <span>추가</span>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
      )}
      {existingImages.length + uploadedImages.length >= 20 && (
        <p className="mt-2 text-start text-body3-12-medium text-red-500">최대 20장까지만 업로드 가능합니다.</p>
      )}
    </div>
  );
};

export default ImageUploader;

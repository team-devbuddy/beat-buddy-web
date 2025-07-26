'use client';

import React, { ChangeEvent } from 'react';
import Image from 'next/image'; // Next.js Image import

interface ImageUploaderProps {
  onUpload: (images: string[]) => void;
  uploadedImages: string[];
}

const ImageUploader = ({ onUpload, uploadedImages }: ImageUploaderProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      if (uploadedImages.length + fileArray.length > 5) {
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
    <div className="relative px-4">
      {uploadedImages.length === 0 ? (
        // 초기 UI: 이미지가 없는 상태
        <div className="mt-7 rounded-xs border border-gray300 bg-gray500 py-[2.5rem]">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center text-gray100">
            <img src="/icons/folder-plus-02.svg" alt="Upload Icon" className="mb-2 h-12 w-12" />
            <span>포스터 및 사진을 추가해주세요.</span>
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
        // 이미지 업로드 이후 UI
        <div className="no-scrollbar mt-7 flex items-center space-x-4 overflow-x-scroll">
          {/* 업로드된 이미지 */}
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative h-[9.8rem] w-[9.8rem] flex-shrink-0 rounded-xs bg-gray500">
              {/* 업로드된 이미지 */}
              <Image src={image} alt={`Uploaded ${index}`} fill sizes="9.8rem" className="rounded-xs object-cover" />
              {/* 삭제 버튼 */}
              <div onClick={() => handleRemoveImage(index)} className="absolute right-1 top-1">
                <Image
                  src="/icons/x-square-contained.svg"
                  alt="Remove Icon"
                  width={24}
                  height={24}
                  className="hover:opacity-80"
                />
              </div>
              {/* 순번 라벨 */}
              <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                {index + 1}/{uploadedImages.length}
              </div>
            </div>
          ))}
          {/* 업로더 박스 */}
          {uploadedImages.length < 5 && (
            <div className="relative h-[9.8rem] w-[9.8rem] flex-shrink-0 rounded-xs border border-dashed border-gray300 bg-gray500">
              <label
                htmlFor="image-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray100">
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
      {/* 업로드 제한 안내 */}
      {uploadedImages.length >= 5 && (
        <p className="mt-2 text-start text-body3-12-medium text-red-500">최대 5장까지만 업로드 가능합니다.</p>
      )}
    </div>
  );
};

export default ImageUploader;

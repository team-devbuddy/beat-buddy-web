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
        alert('최대 5장까지만 업로드할 수 있습니다.');
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
      {uploadedImages.length === 0 ? (
        // 초기 UI: 이미지가 없는 상태
        <div className=" rounded-[0.5rem] mt-5 bg-gray600 py-[4rem]">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center text-gray100">
            <Image src="/icons/folder-plus-02.svg" alt="Upload Icon" width={48} height={48} />
            <span className="text-[0.875rem] mt-[0.38rem] text-gray100">포스터 및 사진을 추가해주세요.</span>
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
              <Image
                src={image}
                alt={`Uploaded ${index}`}
                layout="fill" // 이미지를 컨테이너에 맞게 채움
                objectFit="cover" // 잘리더라도 컨테이너 비율에 맞춰 채우기
                className="rounded-xs"
              />
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

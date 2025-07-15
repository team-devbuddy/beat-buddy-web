'use client';

import React, { ChangeEvent } from 'react';
import Image from 'next/image';

interface ImageUploaderProps {
  onUpload: (images: File[]) => void;
  uploadedImages: File[];
}

const ImageUploader = ({ onUpload, uploadedImages }: ImageUploaderProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);

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
    <div className="relative px-5">
      {uploadedImages.length === 0 ? (
        <div className="rounded-[0.5rem] mt-5 bg-gray600 py-[4rem]">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer flex-col items-center justify-center text-gray100"
          >
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
        <div className="no-scrollbar mt-7 flex items-center space-x-4 overflow-x-scroll">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative h-[9.8rem] w-[9.8rem] flex-shrink-0 rounded-xs bg-gray500">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Uploaded ${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-xs"
              />
              <div onClick={() => handleRemoveImage(index)} className="absolute right-1 top-1 cursor-pointer">
                <Image
                  src="/icons/x-square-contained.svg"
                  alt="Remove Icon"
                  width={24}
                  height={24}
                  className="hover:opacity-80"
                />
              </div>
              <div className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                {index + 1}/{uploadedImages.length}
              </div>
            </div>
          ))}
          {uploadedImages.length < 5 && (
            <div className="relative h-[9.8rem] w-[9.8rem] flex-shrink-0 rounded-xs border border-dashed border-gray300 bg-gray500">
              <label
                htmlFor="image-upload"
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-gray100"
              >
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
      {uploadedImages.length >= 5 && (
        <p className="mt-2 text-start text-body3-12-medium text-red-500">최대 5장까지만 업로드 가능합니다.</p>
      )}
    </div>
  );
};

export default ImageUploader;

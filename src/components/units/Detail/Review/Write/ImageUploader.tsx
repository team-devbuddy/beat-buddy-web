'use client';

import React, { ChangeEvent } from 'react';

interface ImageUploaderProps {
  onUpload: (images: string[]) => void;
  uploadedImages: string[];
}

const ImageUploader = ({ onUpload, uploadedImages }: ImageUploaderProps) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      onUpload([...uploadedImages, ...fileArray]);
    }
  };

  return (
    <div className="px-4">
      <div className="mt-7 rounded-xs border border-gray500 bg-gray500 py-[2.5rem]">
        <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center text-gray100">
          <img src="/icons/folder-plus-02.svg" alt="Upload Icon" className="mb-2 h-12 w-12" />
          <span>사진이나 영상을 추가해주세요.</span>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative">
              <img src={image} alt={`Uploaded ${index}`} className="h-24 w-full rounded-md object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;

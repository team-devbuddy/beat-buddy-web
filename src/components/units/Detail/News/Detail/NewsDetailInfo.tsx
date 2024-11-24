'use client';

import CustomerService from '../../CustomerService';
interface NewsInfoProps {
  description: string;
  images: string[]; // 이미지 배열 추가
}

const NewsDetailInfo = ({ description, images }: NewsInfoProps) => {
  return (
    <div className="bg-BG-black">
      {/* 행사 소개 섹션 */}
      <div className="px-4">
        <h3 className="mb-3 pt-4  text-body1-16-bold">행사 소개</h3>
        <pre className="mb-6 whitespace-pre-wrap text-body2-15-medium leading-relaxed text-gray300">{description}</pre>
      </div>
      {/* 이미지 섹션 */}
      <div className="">
        {images.map((image, index) => (
          <img key={index} src={image} alt={`뉴스 이미지 ${index + 1}`} className="w-full" />
        ))}
      </div>
      <CustomerService />
    </div>
  );
};

export default NewsDetailInfo;

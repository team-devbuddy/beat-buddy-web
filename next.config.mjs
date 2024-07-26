/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['beatbuddy-image.s3.ap-northeast-2.amazonaws.com'], // 여기에 외부 도메인을 추가합니다.
  },
};

export default nextConfig;

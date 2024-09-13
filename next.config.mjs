/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['beatbuddy-image.s3.ap-northeast-2.amazonaws.com', 'beatbuddy-venue.s3.ap-northeast-2.amazonaws.com'],
    formats: ['image/webp'],
  },
};

export default nextConfig;

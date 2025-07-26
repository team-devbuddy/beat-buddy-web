/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'beatbuddy-image.s3.ap-northeast-2.amazonaws.com',
      'beatbuddy-venue.s3.ap-northeast-2.amazonaws.com',
      'beatbuddy.s3.ap-northeast-2.amazonaws.com',
    ],
    formats: ['image/webp'],
  },
  webpack: (config, { isServer }) => {
    // 청크 로딩 안정성 개선
    if (!isServer) {
      // splitChunks가 false인 경우 객체로 초기화
      if (config.optimization.splitChunks === false) {
        config.optimization.splitChunks = {
          chunks: 'async',
          cacheGroups: {
            default: {
              minChunks: 1,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        };
      } else if (config.optimization.splitChunks && typeof config.optimization.splitChunks === 'object') {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
        };
      }
    }
    return config;
  },
  // 개발 환경에서의 청크 로딩 개선
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;

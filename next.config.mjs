/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'globemily.s3.amazonaws.com'
      }
    ]
  }
};

export default nextConfig;

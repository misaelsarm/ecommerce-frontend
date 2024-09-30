/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'globemily.s3.amazonaws.com'
      },
      {
        hostname: 'wearerethink.nyc3.cdn.digitaloceanspaces.com'
      },
    ]
  }
};

export default nextConfig;

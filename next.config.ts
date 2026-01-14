/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'cdn.pixabay.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'example.com' },
      { hostname: 'img.freepik.com' },
      { hostname: 'www.freepik.com' }
    ],
  },
};

export default nextConfig;

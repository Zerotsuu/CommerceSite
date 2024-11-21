import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'utfs.io',
      pathname: '/f/**'
    },{
      protocol: 'https',
      hostname: 's4.anilist.co',
      pathname: '/file/anilistcdn/media/manga/cover/small/**'
    }]
  }
  /* config options here */
};

export default nextConfig;

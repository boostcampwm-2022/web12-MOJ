/** @type {import('next').NextConfig} */

import Dotenv from 'dotenv-webpack';

const nextConfig = {
  webpack: (config) => {
    config.plugins.push(new Dotenv({ silent: true }));
    return config;
  },
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [
      { source: '/api/:slug*', destination: `http://localhost:4000/:slug*` },
    ];
  },
};

export default nextConfig;

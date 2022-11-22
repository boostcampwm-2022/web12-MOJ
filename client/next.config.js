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
};

export default nextConfig;

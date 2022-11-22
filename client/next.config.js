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
      {
        source: '/api/github-login',
        destination: `http://localhost:4000/users/oauth`,
      },
    ];
  },
};

export default nextConfig;

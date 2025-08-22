/** @type {import('next').NextConfig} */
const dev = process.env.NODE_ENV !== 'production';

const nextConfig = {
  output: 'export',
  basePath: dev ? '' : '/Battleship',
  assetPrefix: dev ? '' : '/Battleship/',
};

export default nextConfig;

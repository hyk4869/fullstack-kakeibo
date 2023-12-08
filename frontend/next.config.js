/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/main',
        destination: '/',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// export const reactStrictMode = true;
// export const experimental = {
//   forceSwcTransforms: true,
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'zh-CN'],
    defaultLocale: 'zh-CN',
  },
};

module.exports = nextConfig;
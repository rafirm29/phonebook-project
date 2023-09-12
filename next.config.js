/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/contact-list',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig

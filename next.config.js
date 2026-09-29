/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export required so the app can run from Capacitor's local
  // webDir (out/) with no Node/Next server at runtime on the device.
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true, // next/image optimization needs a server; disable for static export
  },
  trailingSlash: true, // makes every route resolve to /route/index.html, which Capacitor's WebView needs
  reactStrictMode: true,
};

module.exports = nextConfig;

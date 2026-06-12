import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "N3xUs Konc3pt'z | Digital Design Studio",
    short_name: "N3xUs Konc3pt'z",
    description:
      'Premium digital design studio specializing in custom Discord bots, Telegram bots, API development, and stunning digital design.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a1a',
    theme_color: '#00f0ff',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon-square.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
  };
}

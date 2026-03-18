import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lunário · Ciclos & Metas',
    short_name: 'Lunário',
    description: 'Planificador lento guiado pelos ciclos lunares e astrológicos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0e0d0b',
    theme_color: '#0e0d0b',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navigation from '@/components/Navigation';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lunário · Ciclos & Metas',
  description:
    'Planificación anual guiada por los ciclos lunares y astrológicos. Slow Productivity para emprendedores.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e0d0b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <body>
        <ThemeProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Navigation />
            <main
              style={{ flex: 1, paddingBottom: '5rem' }}
              className="md:ml-[220px] md:pb-0"
            >
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

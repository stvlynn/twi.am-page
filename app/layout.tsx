import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Silkscreen } from 'next/font/google';
import { PixelBackground } from '@/components/ui/PixelBackground';
import { getConfig } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});
const silkscreen = Silkscreen({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-silkscreen',
});

const config = getConfig();

export const metadata: Metadata = {
  title: config.og.title,
  description: config.og.description,
  openGraph: {
    title: config.og.title,
    description: config.og.description,
    url: config.og.url,
    siteName: config.og.title,
    images: [
      {
        url: config.og.image,
        width: 760,
        height: 468,
      },
    ],
    locale: 'en_US',
    type: config.og.type,
  },
  twitter: {
    card: 'summary_large_image',
    title: config.og.title,
    description: config.og.description,
    images: [config.og.image],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} ${silkscreen.variable}`}>
        <PixelBackground />
        {children}
      </body>
    </html>
  );
}
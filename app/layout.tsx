import './globals.css';
import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/silkscreen/400.css';
import '@fontsource/silkscreen/700.css';

import { PixelBackground } from '@/components/ui/PixelBackground';

const config = getConfig();

export const metadata: Metadata = {
  title: config.og.title,
  description: config.og.description,
  metadataBase: new URL('https://twi.am'),
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
      <body className="font-inter">
        <PixelBackground />
        {children}
      </body>
    </html>
  );
}
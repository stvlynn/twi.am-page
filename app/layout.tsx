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
  title: {
    default: config.og.title,
    template: `%s | ${config.og.title}`,
  },
  description: config.og.description,
  metadataBase: new URL('https://twi.am'),
  applicationName: 'Twi.am',
  authors: [{ name: 'Steven Lynn', url: 'https://twitter.com/stv_lynn' }],
  generator: 'Next.js',
  keywords: [
    'Twitter Analytics',
    'AI Analytics',
    'Social Media Insights',
    'Twitter Personality',
    'AI Portrait',
    'MBTI Analysis',
    'Twitter MBTI',
    'Social Media Analytics',
    'Personal Analytics',
    'AI Tools'
  ],
  creator: 'Steven Lynn',
  publisher: 'Twi.am',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        alt: 'Twi.am - AI-powered Twitter Analytics',
      },
    ],
    locale: 'en_US',
    type: config.og.type,
  },
  twitter: {
    card: 'summary_large_image',
    title: config.og.title,
    description: config.og.description,
    creator: '@stv_lynn',
    site: '@stv_lynn',
    images: [
      {
        url: config.og.image,
        alt: 'Twi.am - AI-powered Twitter Analytics',
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-site-verification', // 需要替换为实际的验证码
  },
  category: 'Technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://twi.am" />
        <meta name="theme-color" content="#1DA1F2" />
      </head>
      <body className="font-inter">
        <PixelBackground />
        {children}
      </body>
    </html>
  );
}
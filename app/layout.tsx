import './globals.css';
import type { Metadata } from 'next';
import { getConfig } from '@/lib/config';
import { UserAvatar } from '@/components/UserAvatar';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/silkscreen/400.css';
import '@fontsource/silkscreen/700.css';

import { PixelBackground } from '@/components/ui/PixelBackground';

// 因为我们使用cookies，强制动态渲染
export const dynamic = 'force-dynamic';

const config = getConfig();
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://twi.am';

export const metadata: Metadata = {
  title: {
    default: config.og.title,
    template: `%s | ${config.og.title}`,
  },
  description: config.og.description,
  metadataBase: new URL(appUrl),
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
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
  },
  openGraph: {
    title: config.og.title,
    description: config.og.description,
    url: config.og.url || appUrl,
    siteName: config.og.title,
    images: [
      {
        url: config.og.image,
        width: 512,
        height: 512,
        alt: 'Twi.am - AI-powered Twitter Analytics',
      },
    ],
    locale: 'en_US',
    type: config.og.type,
  },
  twitter: {
    card: 'summary',
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
        <link rel="canonical" href={appUrl} />
        <meta name="theme-color" content="#1DA1F2" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="font-inter">
        <PixelBackground />
        <div className="fixed top-4 right-4 z-50">
          <UserAvatar />
        </div>
        {children}
      </body>
    </html>
  );
}
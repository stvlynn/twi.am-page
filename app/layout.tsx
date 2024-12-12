import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Silkscreen } from 'next/font/google';
import { PixelBackground } from '@/components/ui/PixelBackground';

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

export const metadata: Metadata = {
  title: 'Twi.am',
  description: '',
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
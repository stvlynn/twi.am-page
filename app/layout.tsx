import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { PixelBackground } from '@/components/ui/PixelBackground';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
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
      <body className={`${inter.className} ${playfair.variable}`}>
        <PixelBackground />
        {children}
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Petrona, Albert_Sans } from 'next/font/google';
import './globals.css';

const petrona = Petrona({ subsets: ['latin'], style: ['normal', 'italic'], weight: ['400', '500', '600'], variable: '--font-petrona' });
const albert = Albert_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-albert' });

export const metadata: Metadata = { title: 'PostPal — Daybook', robots: { index: false } };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${petrona.variable} ${albert.variable}`}>
      <body>{children}</body>
    </html>
  );
}

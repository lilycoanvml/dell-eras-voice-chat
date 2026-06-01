import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Next Era Event — Dell Technologies Black Friday',
  description:
    'Five questions. One era. Discover your next chapter with Dell Technologies Black Friday.',
  openGraph: {
    title: 'The Next Era Event',
    description: 'Discover your era — Dell Technologies Black Friday.',
    siteName: 'Dell Technologies',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,300;1,9..144,400&family=Caveat:wght@400;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

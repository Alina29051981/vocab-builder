import type { Metadata } from 'next';
import Header from '../components/Header/Header';
import TanStackProvider from './TanStackProvider';
import { myFonts } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'VocabBuilder',
  description: 'Build your personal vocabulary, get smart recommendations, and train new words effectively.',
  openGraph: {
    title: 'VocabBuilder',
    description: 'Build your personal vocabulary, get smart recommendations, and train new words effectively.',
    // url: 'https://09-auth-rho-two.vercel.app/',
    // images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
   <html lang="en" className={myFonts.variable}>
      <body>
        <TanStackProvider> 
          <Header />
            {children}        
        </TanStackProvider>
      </body>
    </html>
  );
}

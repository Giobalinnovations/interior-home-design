import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'Interior Design - Transform Your Space',
  description:
    'Professional interior design services for your home and office spaces.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <Header />
        {children}
        <Footer />
        {/* Google Analytics */}
        <GoogleAnalytics gaId="AW-11559486298" />
        {/* Google Tag Manager */}
        <GoogleTagManager
          gtmId="GTM-KRH5B6BN"
          dataLayer={{
            event: 'conversion',
            send_to: 'AW-11559486298/pYlxCPyz-oYaENqG_4cr',
          }}
        />
      </body>
    </html>
  );
}

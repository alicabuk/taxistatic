import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';  // Script bileşenini import et
import '../styles/globals.scss';
import allClientConfigs from '../data/clients.json';

const inter = Inter({ subsets: ['latin'] });

interface ClientConfig {
  id: string;
  domain: string;
  title: string;
  description: string;
  taxiName: string;
  mainHeading: string;
  subHeadingText: string;
  whatsappNumber: string;
  phoneNumber: string;
  popularRoutesTitle: string;
  popularRoutes: string[];
  heroImage: string;
  taxiIcon: string;
  googleSiteVerification?: string;
  googleAdsId?: string | null;  // Buraya ekledik
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host');

  let clientConfig: ClientConfig | null = null;

  if (host) {
    clientConfig = allClientConfigs.find(
      (config: any) => config.domain === host || `www.${config.domain}` === host
    ) as ClientConfig;
  }

  if (!clientConfig) {
    clientConfig = allClientConfigs.find((config: any) => config.id === 'default') as ClientConfig;
  }

  const metadata: Metadata = {
    title: clientConfig?.title || 'Taksi Durağı',
    description: clientConfig?.description || 'Şehrin en hızlı ve güvenilir taksi hizmeti.',
    verification: clientConfig?.googleSiteVerification
      ? { google: clientConfig.googleSiteVerification }
      : undefined,
  };

  return metadata;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host');

  let clientConfig: ClientConfig | null = null;

  if (host) {
    clientConfig = allClientConfigs.find(
      (config: any) => config.domain === host || `www.${config.domain}` === host
    ) as ClientConfig;
  }

  if (!clientConfig) {
    clientConfig = allClientConfigs.find((config: any) => config.id === 'default') as ClientConfig;
  }

  return (
    <html lang="tr">
      <head>
        {/* Google Ads Global Tag - Sadece googleAdsId varsa ekle */}
        {clientConfig?.googleAdsId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${clientConfig.googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-global" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${clientConfig.googleAdsId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

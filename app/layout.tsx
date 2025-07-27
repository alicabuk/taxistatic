// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers'; // Layout içinde de headers kullanabiliriz!
import '../styles/globals.scss';
import allClientConfigs from '../data/clients.json'; // Middleware ile aynı JSON dosyasını import edin

const inter = Inter({ subsets: ['latin'] });

// ClientConfig için type definition (page.tsx'teki ile aynı)
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
    googleSiteVerification?: string; // Yeni alan
}

// generateMetadata fonksiyonu, dinamik olarak meta veri oluşturmak için kullanılır
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host');

  let clientConfig: ClientConfig | null = null;

  // Host'a göre doğru client config'i bul
  if (host) {
    clientConfig = allClientConfigs.find(
      (config: any) => config.domain === host || `www.${config.domain}` === host
    ) as ClientConfig;
  }

  // Eğer eşleşen bir client bulunamazsa, varsayılanı kullan
  if (!clientConfig) {
    clientConfig = allClientConfigs.find((config: any) => config.id === 'default') as ClientConfig;
  }

  // Metadata objesini oluştur
  const metadata: Metadata = {
    title: clientConfig?.title || 'Taksi Durağı',
    description: clientConfig?.description || 'Şehrin en hızlı ve güvenilir taksi hizmeti.',
    // ... diğer ortak metadata ayarları

    // Dinamik Google Site Verification
    verification: clientConfig?.googleSiteVerification ? {
      google: clientConfig.googleSiteVerification,
    } : undefined, // Eğer doğrulama kodu yoksa, verification alanını ekleme
  };

  return metadata;
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
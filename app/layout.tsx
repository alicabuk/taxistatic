// app/layout.tsx
import '../styles/globals.scss';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

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
}

export async function generateMetadata() {
  const headersList = await headers();
  const clientDataHeader = headersList.get('x-client-data');
  let clientConfig: ClientConfig | null = null;

  if (clientDataHeader) {
    try {
      // Başlıktan alınan Base64 string'ini decode et ve JSON.parse yap
      clientConfig = JSON.parse(decodeURIComponent(atob(clientDataHeader))); // << BURADA DEĞİŞTİ
    } catch (error) {
      console.error("Failed to parse client data in layout:", error);
    }
  }

  const defaultTitle = 'Taksi Hizmetleri - Hızlı ve Güvenilir';
  const defaultDescription = 'Güvenilir taksi hizmeti için hemen arayın.';

  return {
    title: clientConfig?.title || defaultTitle,
    description: clientConfig?.description || defaultDescription,
  };
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
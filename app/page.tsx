import Image from "next/image";
import { Roboto } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script"; // Script bileşenini import etmeyi unutmayın
import { useCallback } from "react";
import ConversionButtons from "./conversionButtons";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

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
  googleAdsId?: string | null; // Google Ads ID'si eklendi (opsiyonel olabilir)
  googleSiteVerification?: string | null; // Google Site Verification eklendi (opsiyonel olabilir)
  googleConversionLabel?: string;
}

// Önemli: Bu fonksiyonun middleware'dan gelen config'i parse ettiğini varsayıyorum.
// Eğer clientDataHeader, clientConfig'in kendisi değil de base64 encoded string ise bu fonksiyon gerekli.
// Eğer middleware'iniz zaten parse edip doğru formatta veriyorsa, bu fonksiyona ihtiyaç olmayabilir.
function parseClientConfig(encodedConfig: string | null): ClientConfig | null {
  if (!encodedConfig) return null;
  try {
    const decoded = Buffer.from(encodedConfig, "base64").toString("utf8");
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to parse client data from header:", error);
    return null;
  }
}

export default async function Home() {
  const headersList = await headers();
  // Middleware'ınızın client verisini hangi başlıkla gönderdiğinden emin olun.
  // Önceki örneklerde 'X-Client-Config' kullanmıştık. Burada 'x-client-data' olarak güncellediniz.
  const clientDataHeader = headersList.get("x-client-data");

  let clientConfig: ClientConfig | null = null;
  if (clientDataHeader) {
    try {
      clientConfig = parseClientConfig(clientDataHeader); // parseClientConfig fonksiyonunu kullanıyoruz
    } catch (error) {
      console.error("Failed to parse client data from header:", error);
    }
  }

  if (!clientConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Müşteri bilgileri yüklenemedi. Lütfen doğru bir alan adı ile erişin.
      </div>
    );
  }

  // Google Ads ID'sini clientConfig'ten çekiyoruz
  const googleAdsId = clientConfig.googleAdsId;
  const googleSiteVerification = clientConfig.googleSiteVerification; // Google Site Verification ID'si de çekildi

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black text-white overflow-hidden p-4 md:p-8">
      {/* Google Ads Scriptlerini Sadece googleAdsId varsa ekle */}
      {googleAdsId && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            strategy="afterInteractive" // Sayfa etkileşimli hale geldikten sonra yükle
          />
          <Script id="google-ads-gtag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${googleAdsId}');
            `}
          </Script>
        </>
      )}

      {/* Google Site Verification Meta Etiketini Sadece googleSiteVerification varsa ekle */}
      {googleSiteVerification && (
        <meta
          name="google-site-verification"
          content={googleSiteVerification}
        />
      )}

      {/* Background image */}
      <Image
        src={clientConfig.heroImage}
        alt={`${clientConfig.taxiName} Arka Plan`}
        fill
        className="absolute inset-0 w-full h-full object-cover brightness-[0.2]"
        priority
      />

      {/* Sağ Üst Taksi Durağı Logosu ve Metni - Genişliği ayarlandı */}
      {/* max-w-xs eklendi, daha büyük ekranlarda tam sığacak ama küçüklerde taşmayacak. */}
      {/* truncate sınıfı ile taşma durumunda metin kesilir ve ... eklenir */}
      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg z-20 transition-all duration-300 hover:scale-105 max-w-[calc(100%-48px)] sm:max-w-xs">
        <Image
          src={clientConfig.taxiIcon}
          alt={`${clientConfig.taxiName} İkonu`}
          width={32}
          height={32}
        />
        <span className="text-base md:text-lg font-bold text-white tracking-wide truncate">
          {" "}
          {/* truncate eklendi */}
          {clientConfig.taxiName}
        </span>
      </div>

      {/* Sayfanın Tam Ortasındaki Ana İçerik - Genişliği artırıldı */}
      {/* max-w-xl yerine max-w-3xl (daha geniş) veya max-w-screen-md/lg (ekranın orta boylarına göre) kullanıldı */}
      {/* veya tamamen kaldırılabilir. Burada max-w-screen-md kullanıyoruz, tablet boyutlarına kadar genişler */}
      <div
        className={`z-10 w-full max-w-xl md:max-w-3xl lg:max-w-4xl px-4 text-center space-y-8 animate-fade-in-up ${roboto.className}`}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-2xl leading-tight">
          {clientConfig.mainHeading}
        </h1>
        <p className="text-lg md:text-2xl text-white font-light leading-relaxed">
          {clientConfig.subHeadingText}
        </p>

        {/* Duraklar (Popüler Güzergahlar) - SCROLLABLE YAPI İyileştirildi */}
        {/* max-h-48 ve overflow-y-auto duruyor, ancak içeriğin miktarına göre esnekleşecek */}
        {/* Tailwind'in varsayılan overflow-y-auto sınıfı, sadece içerik taştığında kaydırma çubuğunu gösterir. */}
        {/* Bu nedenle ek bir "sığmadıgında olsun" kontrolüne gerek yok. */}
        <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 text-white shadow-2xl border border-gray-700/50 transform hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-xl md:text-2xl font-bold mb-5 text-yellow-300 border-b-2 border-yellow-300/50 pb-3">
            {clientConfig.popularRoutesTitle}
          </h2>
          {/* max-h-48 (veya daha büyük bir değer) ve overflow-y-auto eklendi */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-base md:text-lg font-medium overflow-y-auto max-h-48 custom-scrollbar">
            {clientConfig.popularRoutes.map((route, index) => (
              <li
                key={index}
                className="flex items-center justify-center md:justify-start gap-2 text-white"
              >
                <span className="text-yellow-400 text-xl">🚗</span> {route}
              </li>
            ))}
          </ul>
        </div>

        {/* WhatsApp ve Ara Butonları */}
        <ConversionButtons
          googleAdsId={clientConfig.googleAdsId || ""}
          googleConversionLabel={clientConfig.googleConversionLabel || ""}
          whatsappNumber={clientConfig.whatsappNumber}
          phoneNumber={clientConfig.phoneNumber}
        />
      </div>
    </div>
  );
}
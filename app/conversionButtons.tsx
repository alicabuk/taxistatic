'use client'; // Client Component olduğunu belirt

import React, { useCallback } from "react";

interface Props {
  googleAdsId: string;
  googleConversionLabel: string;
  whatsappNumber: string;
  phoneNumber: string;
}

export default function ConversionButtons({
  googleAdsId,
  googleConversionLabel,
  whatsappNumber,
  phoneNumber,
}: Props) {
  const trackConversion = useCallback((label: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "conversion", {
        send_to: `${googleAdsId}/${googleConversionLabel}`,
      });
    }
  }, [googleAdsId, googleConversionLabel]);

  return (
    <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 mt-10">
      <a
        href={`https://wa.me/${whatsappNumber}`}
        onClick={() => trackConversion("WHATSAPP_CLICK")}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-xl transition transform hover:scale-105 active:scale-95 text-lg md:text-xl relative overflow-hidden ring-2 ring-green-300 ring-offset-2 ring-offset-black"
      >
        <span className="relative z-10">💬 WhatsApp&apos;tan Yaz</span>
        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </a>
      <a
        href={`tel:${phoneNumber}`}
        onClick={() => trackConversion("CALL_CLICK")}
        className="group flex items-center justify-center gap-3 bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-xl transition transform hover:scale-105 active:scale-95 text-lg md:text-xl relative overflow-hidden ring-2 ring-yellow-200 ring-offset-2 ring-offset-black"
      >
        <span className="relative z-10">📞 Hemen Ara</span>
        <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      </a>
    </div>
  );
}

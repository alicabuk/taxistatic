// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Tüm client configlerini içeren tek bir dosyayı import edin
import allClientConfigs from './data/clients.json';

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host'); // Gelen isteğin domain'ini al

  let clientConfig = allClientConfigs.find(
    (config: any) => config.domain === host || `www.${config.domain}` === host
  );

  // Eğer eşleşen bir client bulunamazsa, varsayılanı bul
  if (!clientConfig) {
    clientConfig = allClientConfigs.find((config: any) => config.id === 'default');
    // Eğer varsayılan da bulunamazsa (ki olmamalı), hata fırlat veya boş dön
    if (!clientConfig) {
      return new NextResponse('Internal Server Error: Default client config not found', { status: 500 });
    }
  }

  const requestHeaders = new Headers(request.headers);
  const encodedClientConfig = Buffer.from(JSON.stringify(clientConfig)).toString('base64');
  requestHeaders.set('x-client-data', encodedClientConfig);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
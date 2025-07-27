// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

import mersinData from './data/mersin.json';
import adanaData from './data/adana.json';

const clientConfigs = [mersinData, adanaData];

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

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  let hostname = req.headers.get('host') || '';

  if (hostname.includes('localhost')) {
    const clientParam = url.searchParams.get('client');
    if (clientParam) {
      const selectedClient = clientConfigs.find((c) => c.id === clientParam);
      if (selectedClient) {
        hostname = selectedClient.domain;
      } else {
        hostname = clientConfigs[0].domain;
      }
    } else {
      hostname = clientConfigs[0].domain;
    }
  }

  hostname = hostname.replace(/^www\./, '');

  const currentClient = clientConfigs.find((client) => client.domain === hostname);

  if (!currentClient) {
    console.warn(`Unknown domain: ${hostname}. Serving default client.`);
    const requestHeaders = new Headers(req.headers);
    // Varsayılan müşteri verisini Base64 olarak kodla
    requestHeaders.set('x-client-data', btoa(encodeURIComponent(JSON.stringify(clientConfigs[0])))); // << BURADA DEĞİŞTİ
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const requestHeaders = new Headers(req.headers);
  // Müşteri verisini Base64 olarak kodla
  requestHeaders.set('x-client-data', btoa(encodeURIComponent(JSON.stringify(currentClient)))); // << BURADA DEĞİŞTİ

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/',
};
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextAuthProvider } from './providers';
import Header from '@/components/Header';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Network Canvas',
  description: 'Created By Isaac Tshiteta',
}


export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string | undefined };
  }) {
    let messages;
    try {
      messages = (await import(`../../translations/${locale}.json`)).default;
    } catch (error) {
      notFound();
    }
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <NextAuthProvider locale={locale}>
            <Header />
            {children}
          </NextAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

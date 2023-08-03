'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  children?: React.ReactNode;
  locale: string | undefined;
};

export const NextAuthProvider = ({ children, locale }: Props) => {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <LocaleSwitcher locale={locale} />
        {children}
        <ToastContainer />
      </ThemeProvider>
    </SessionProvider>
  );
};

"use client";

import "./globals.css";
import { PhantomWalletProvider } from './components/PhantomWallet';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useState } from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  const [currentLocale, setCurrentLocale] = useState('en');

  return (
    <html lang={currentLocale} suppressHydrationWarning className="h-full">
      <head>
        <title>SolanaLearningQuest</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="h-full font-sans">
        <PhantomWalletProvider>
          <div className="fixed top-4 right-4 z-[60]">
            <LanguageSwitcher />
          </div>
          {children}
        </PhantomWalletProvider>
      </body>
    </html>
  );
}

export default RootLayout;

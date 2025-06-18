"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import CharacterAvatar from "./components/CharacterAvatar";
import { useTranslation } from "./hooks/useTranslation";
import { Toaster, toast } from "sonner";
import { Icon } from "@iconify/react";
import { usePhantomWallet } from "./components/PhantomWallet";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const { phantom, connected, publicKey, connect, disconnect } = usePhantomWallet();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      if (!connected) {
        await connect();
      } else {
        router.push("/game");
      }
    } catch (error) {
      console.error("Connection failed:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      router.push("/game");
    }
  }, [connected, publicKey, router]);

  return (
    <div className="bg-[radial-gradient(circle,#1a1d29,#242A37,#29313F)] min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center space-y-8">
          
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Icon icon="solar:graduation-bold" className="text-white text-4xl" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {t('homepage.title')}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 font-medium">
              {t('homepage.subtitle')}
            </h2>
          </div>

          {/* Character Preview */}
          <div className="flex justify-center space-x-6 my-8">
            <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4 w-32 h-32 flex flex-col items-center justify-center">
              <CharacterAvatar level={1} experience={0} size="small" emotion="thinking" />
            </div>
            <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4 w-32 h-32 flex flex-col items-center justify-center">
              <CharacterAvatar level={5} experience={1000} size="small" emotion="happy" />
            </div>
            <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4 w-32 h-32 flex flex-col items-center justify-center">
              <CharacterAvatar level={10} experience={2000} size="small" emotion="celebrating" />
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(255,255,255,0.1)]">
              <Icon icon="solar:brain-bold" className="text-purple-400 text-3xl mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">{t('homepage.features.aiLearning.title')}</h3>
              <p className="text-gray-400 text-sm">{t('homepage.features.aiLearning.description')}</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(255,255,255,0.1)]">
              <Icon icon="solar:gameboy-bold" className="text-blue-400 text-3xl mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">{t('homepage.features.gamified.title')}</h3>
              <p className="text-gray-400 text-sm">{t('homepage.features.gamified.description')}</p>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] rounded-lg p-6 border border-[rgba(255,255,255,0.1)]">
              <Icon icon="solar:document-text-bold" className="text-green-400 text-3xl mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">{t('homepage.features.nftCerts.title')}</h3>
              <p className="text-gray-400 text-sm">{t('homepage.features.nftCerts.description')}</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={handleStartGame}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('homepage.cta.connecting')}</span>
                </div>
              ) : connected ? (
                t('homepage.cta.enterGame')
              ) : (
                t('homepage.cta.connectAndStart')
              )}
            </button>
            {!connected && (
              <p className="text-gray-400 text-sm mt-3">
                {t('homepage.cta.poweredBy')}
              </p>
            )}
          </div>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-[rgba(42,43,54,0.8)] text-white border border-[rgba(255,255,255,0.1)] shadow-lg",
          duration: 2500
        }}
      />
    </div>
  );
}
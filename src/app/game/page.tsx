"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePhantomWallet } from "../components/PhantomWallet";
import GameDashboard from "../components/GameDashboard";
import AITutor from "../components/AITutor";
import QuizArena from "../components/QuizArena";
import Leaderboard from "../components/Leaderboard";
import NFTCertificate from "../components/NFTCertificate";
import CharacterAvatar from "../components/CharacterAvatar";
import { useTranslation } from "../hooks/useTranslation";
import { Icon } from "@iconify/react";
import { Toaster } from "sonner";

type GameView = "dashboard" | "quiz" | "tutor" | "leaderboard" | "nft";

export default function GamePage() {
  const router = useRouter();
  const { connected, publicKey, disconnect } = usePhantomWallet();
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<GameView>("dashboard");
  const [playerLevel, setPlayerLevel] = useState(1);
  const [playerExperience, setPlayerExperience] = useState(150);

  // Redirect to home if not connected
  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  const handleLogout = () => {
    disconnect();
    router.push("/");
  };

  // Don't render anything if not connected (prevents flash)
  if (!connected) {
    return null;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <GameDashboard setCurrentView={setCurrentView} />;
      case "quiz":
        return <QuizArena setCurrentView={setCurrentView} />;
      case "tutor":
        return <AITutor setCurrentView={setCurrentView} />;
      case "leaderboard":
        return <Leaderboard setCurrentView={setCurrentView} />;
      case "nft":
        return <NFTCertificate setCurrentView={setCurrentView} />;
      default:
        return <GameDashboard setCurrentView={setCurrentView} />;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case "dashboard":
        return t("game.dashboard.title");
      case "quiz":
        return t("game.quiz.title");
      case "tutor":
        return t("game.tutor.title");
      case "leaderboard":
        return t("game.leaderboard.title");
      case "nft":
        return t("game.nft.title");
      default:
        return t("game.dashboard.title");
    }
  };

  return (
    <div className="bg-[radial-gradient(circle,#1a1d29,#242A37,#29313F)] min-h-screen">
      {/* Header */}
      <header className="bg-[rgba(32,36,45,0.8)] backdrop-blur-sm border-b border-[rgba(255,255,255,0.1)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Icon icon="solar:graduation-bold" className="text-white text-xl" />
                </div>
                <h1 className="text-xl font-bold text-white">SolanaLearningQuest</h1>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-1">
                {[
                  { id: "dashboard", label: t("navigation.dashboard"), icon: "solar:home-bold" },
                  { id: "quiz", label: t("navigation.quizArena"), icon: "solar:gameboy-bold" },
                  { id: "tutor", label: t("navigation.aiTutor"), icon: "solar:user-bold" },
                  { id: "leaderboard", label: t("navigation.leaderboard"), icon: "solar:ranking-bold" },
                  { id: "nft", label: t("navigation.nftCertificates"), icon: "solar:medal-star-bold" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as GameView)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      currentView === item.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
                    }`}
                  >
                    <Icon icon={item.icon} className="text-lg" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Right side - Character and User Info */}
            <div className="flex items-center space-x-4">
              {/* Character Avatar */}
              <div className="hidden sm:block">
                <CharacterAvatar 
                  level={playerLevel} 
                  experience={playerExperience} 
                  size="small" 
                  emotion="happy" 
                />
              </div>
              
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-white text-sm font-medium">
                    {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                  </div>
                  <div className="text-gray-400 text-xs">Level {playerLevel}</div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-all"
                  title="Logout"
                >
                  <Icon icon="solar:logout-bold" className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Navigation */}
          <div className="md:hidden mb-6">
            <div className="bg-[#20242D] rounded-lg border border-[rgba(255,255,255,0.1)] p-2">
              <div className="flex space-x-1 overflow-x-auto">
                {[
                  { id: "dashboard", label: t("navigation.dashboard"), icon: "solar:home-bold" },
                  { id: "quiz", label: t("navigation.quizArena"), icon: "solar:gameboy-bold" },
                  { id: "tutor", label: t("navigation.aiTutor"), icon: "solar:user-bold" },
                  { id: "leaderboard", label: t("navigation.leaderboard"), icon: "solar:ranking-bold" },
                  { id: "nft", label: t("navigation.nftCertificates"), icon: "solar:medal-star-bold" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as GameView)}
                    className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                      currentView === item.id
                        ? "bg-purple-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
                    }`}
                  >
                    <Icon icon={item.icon} className="text-lg" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current View */}
          <div className="space-y-6">
            {renderCurrentView()}
          </div>
        </div>
      </main>

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
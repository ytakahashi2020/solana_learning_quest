"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePhantomWallet } from "./PhantomWallet";
import { useTranslation } from "../hooks/useTranslation";

interface GameDashboardProps {
  setCurrentView: (view: "dashboard" | "quiz" | "tutor" | "leaderboard" | "nft") => void;
}

interface PlayerStats {
  level: number;
  experience: number;
  points: number;
  streakDays: number;
  completedQuizzes: number;
  totalQuizzes: number;
  rank: number;
  badges: string[];
}

const GameDashboard: React.FC<GameDashboardProps> = ({ setCurrentView }) => {
  const { publicKey } = usePhantomWallet();
  const { t, locale } = useTranslation();
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    experience: 150,
    points: 1250,
    streakDays: 5,
    completedQuizzes: 12,
    totalQuizzes: 45,
    rank: 42,
    badges: ["beginner", "consistent", "blockchain-basic"]
  });

  // Calculate level progress
  const getExperienceForLevel = (level: number) => level * 200;
  const currentLevelExp = getExperienceForLevel(playerStats.level);
  const nextLevelExp = getExperienceForLevel(playerStats.level + 1);
  const progressPercentage = ((playerStats.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

  const categories = [
    {
      id: "basics",
      name: t("game.dashboard.categories.basics.name"),
      icon: "solar:book-bold",
      progress: 80,
      totalQuizzes: 15,
      completedQuizzes: 12,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "solana",
      name: t("game.dashboard.categories.solana.name"), 
      icon: "solar:cpu-bolt-bold",
      progress: 60,
      totalQuizzes: 20,
      completedQuizzes: 12,
      color: "from-purple-500 to-blue-500"
    },
    {
      id: "defi",
      name: t("game.dashboard.categories.defi.name"),
      icon: "solar:wallet-bold",
      progress: 30,
      totalQuizzes: 18,
      completedQuizzes: 5,
      color: "from-green-500 to-teal-500"
    },
    {
      id: "nft",
      name: t("game.dashboard.categories.nft.name"),
      icon: "solar:gallery-bold",
      progress: 45,
      totalQuizzes: 12,
      completedQuizzes: 5,
      color: "from-pink-500 to-purple-500"
    }
  ];

  const achievements = [
    {
      id: "first-quiz",
      name: t("game.dashboard.achievements.firstSteps.name"),
      description: t("game.dashboard.achievements.firstSteps.description"),
      icon: "solar:star-bold",
      earned: true,
      date: "2024-06-15"
    },
    {
      id: "streak-7",
      name: t("game.dashboard.achievements.weekWarrior.name"),
      description: t("game.dashboard.achievements.weekWarrior.description"),
      icon: "solar:fire-bold",
      earned: false,
      progress: 5,
      target: 7
    },
    {
      id: "perfect-score",
      name: t("game.dashboard.achievements.perfectMind.name"),
      description: t("game.dashboard.achievements.perfectMind.description"),
      icon: "solar:medal-star-bold",
      earned: true,
      date: "2024-06-14"
    },
    {
      id: "blockchain-master",
      name: t("game.dashboard.achievements.blockchainMaster.name"),
      description: t("game.dashboard.achievements.blockchainMaster.description"),
      icon: "solar:crown-bold",
      earned: false,
      progress: 12,
      target: 15
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {t("game.dashboard.welcome", { address: `${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}` })}
        </h1>
        <p className="text-gray-300">{t("game.dashboard.subtitle")}</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Level Card */}
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Icon icon="solar:crown-bold" className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{t("game.dashboard.stats.level", { level: playerStats.level })}</h3>
                <p className="text-gray-400 text-sm">{t("game.dashboard.stats.explorer")}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">{t("game.dashboard.stats.progress")}</span>
              <span className="text-white">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {playerStats.experience - currentLevelExp} / {nextLevelExp - currentLevelExp} XP
            </p>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <Icon icon="solar:dollar-bold" className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t("game.dashboard.stats.points")}</h3>
              <p className="text-gray-400 text-sm">{t("game.dashboard.stats.learningCredits")}</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{playerStats.points.toLocaleString()}</div>
          <p className="text-green-400 text-sm">{t("game.dashboard.stats.today", { points: "150" })}</p>
        </div>

        {/* Streak Card */}
        <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Icon icon="solar:fire-bold" className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t("game.dashboard.stats.streak")}</h3>
              <p className="text-gray-400 text-sm">{t("game.dashboard.stats.dailyLearning")}</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{playerStats.streakDays} days</div>
          <p className="text-orange-400 text-sm">{t("game.dashboard.stats.keepItUp")}</p>
        </div>

        {/* Rank Card */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
              <Icon icon="solar:ranking-bold" className="text-white text-2xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{t("game.dashboard.stats.globalRank")}</h3>
              <p className="text-gray-400 text-sm">{t("game.dashboard.stats.leaderboard")}</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">#{playerStats.rank}</div>
          <button 
            onClick={() => setCurrentView("leaderboard")}
            className="text-yellow-400 text-sm hover:underline"
          >
            {t("game.dashboard.stats.viewLeaderboard")}
          </button>
        </div>
      </div>

      {/* Learning Categories */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {locale === 'ja' ? '学習カテゴリ' : 'Learning Categories'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
              onClick={() => setCurrentView("quiz")}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <Icon icon={category.icon} className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{category.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {category.id === "basics" 
                        ? t("game.dashboard.categories.basics.completed", { completed: category.completedQuizzes, total: category.totalQuizzes })
                        : category.id === "solana"
                        ? t("game.dashboard.categories.solana.completed", { completed: category.completedQuizzes, total: category.totalQuizzes })
                        : category.id === "defi"
                        ? t("game.dashboard.categories.defi.completed", { completed: category.completedQuizzes, total: category.totalQuizzes })
                        : t("game.dashboard.categories.nft.completed", { completed: category.completedQuizzes, total: category.totalQuizzes })
                      }
                    </p>
                  </div>
                </div>
                <Icon icon="solar:arrow-right-bold" className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{t("game.dashboard.stats.progress")}</span>
                  <span className="text-white">{category.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all`}
                    style={{ width: `${category.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {locale === 'ja' ? '実績' : 'Achievements'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`bg-[#20242D] rounded-xl border p-4 ${
                achievement.earned 
                  ? "border-green-500/50 bg-green-500/5" 
                  : "border-[rgba(255,255,255,0.1)]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  achievement.earned 
                    ? "bg-green-500" 
                    : "bg-gray-600"
                }`}>
                  <Icon icon={achievement.icon} className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{achievement.name}</h4>
                  <p className="text-gray-400 text-sm">{achievement.description}</p>
                  {achievement.earned ? (
                    <p className="text-green-400 text-xs">
                      {achievement.id === "first-quiz" 
                        ? t("game.dashboard.achievements.firstSteps.earned", { date: achievement.date })
                        : t("game.dashboard.achievements.perfectMind.earned", { date: achievement.date })
                      }
                    </p>
                  ) : (
                    <p className="text-gray-400 text-xs">
                      {achievement.id === "streak-7" 
                        ? t("game.dashboard.achievements.weekWarrior.progress", { current: achievement.progress, target: achievement.target })
                        : t("game.dashboard.achievements.blockchainMaster.progress", { current: achievement.progress, target: achievement.target })
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          {locale === 'ja' ? 'クイックアクション' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => setCurrentView("tutor")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <Icon icon="solar:user-bold" className="text-xl" />
              <span>{t("game.dashboard.actions.chatWithAI")}</span>
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentView("quiz")}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <Icon icon="solar:gameboy-bold" className="text-xl" />
              <span>{t("game.dashboard.actions.startQuiz")}</span>
            </div>
          </button>

          <button 
            onClick={() => setCurrentView("nft")}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <Icon icon="solar:medal-star-bold" className="text-xl" />
              <span>{t("game.dashboard.actions.viewNFTs")}</span>
            </div>
          </button>
          
          <button 
            onClick={() => setCurrentView("leaderboard")}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <Icon icon="solar:ranking-bold" className="text-xl" />
              <span>{t("game.dashboard.actions.viewLeaderboard")}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
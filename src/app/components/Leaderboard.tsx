"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePhantomWallet } from "./PhantomWallet";

interface LeaderboardPlayer {
  id: string;
  address: string;
  displayName: string;
  totalPoints: number;
  level: number;
  streak: number;
  completedQuizzes: number;
  averageScore: number;
  nftsClaimed: number;
  rank: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  setCurrentView: (view: "dashboard" | "quiz" | "tutor" | "leaderboard" | "nft") => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ setCurrentView }) => {
  const { publicKey } = usePhantomWallet();
  const [timeFrame, setTimeFrame] = useState<"weekly" | "monthly" | "allTime">("weekly");
  const [category, setCategory] = useState<"overall" | "blockchain-basics" | "solana-fundamentals" | "defi-protocols" | "nft-tokens">("overall");
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);

  useEffect(() => {
    // Generate mock leaderboard data
    const generateMockData = () => {
      const mockPlayers: LeaderboardPlayer[] = [
        {
          id: "1",
          address: "7Kf8h2Gk...9Nw3",
          displayName: "SolanaWizard",
          totalPoints: 15420,
          level: 12,
          streak: 28,
          completedQuizzes: 142,
          averageScore: 94,
          nftsClaimed: 8,
          rank: 1
        },
        {
          id: "2", 
          address: "3Hn9k5Md...2Lp7",
          displayName: "CryptoExplorer",
          totalPoints: 14850,
          level: 11,
          streak: 21,
          completedQuizzes: 138,
          averageScore: 91,
          nftsClaimed: 7,
          rank: 2
        },
        {
          id: "3",
          address: "9Bc4j7Ne...8Qr5",
          displayName: "DeFiMaster",
          totalPoints: 13720,
          level: 10,
          streak: 15,
          completedQuizzes: 125,
          averageScore: 89,
          nftsClaimed: 6,
          rank: 3
        },
        {
          id: "4",
          address: "6Wt3m8Kx...4Sz9",
          displayName: "BlockchainPro",
          totalPoints: 12950,
          level: 10,
          streak: 12,
          completedQuizzes: 119,
          averageScore: 87,
          nftsClaimed: 5,
          rank: 4
        },
        {
          id: "5",
          address: "2Rv7n4Hq...6Yp3",
          displayName: "NFTCollector",
          totalPoints: 11830,
          level: 9,
          streak: 18,
          completedQuizzes: 108,
          averageScore: 85,
          nftsClaimed: 6,
          rank: 5
        }
      ];

      // Add current user to leaderboard if connected
      if (publicKey) {
        const currentUser: LeaderboardPlayer = {
          id: "current",
          address: publicKey.toString(),
          displayName: "You",
          totalPoints: 8750,
          level: 7,
          streak: 5,
          completedQuizzes: 67,
          averageScore: 82,
          nftsClaimed: 3,
          rank: 12,
          isCurrentUser: true
        };

        // Insert current user in appropriate position
        const updatedPlayers = [...mockPlayers];
        updatedPlayers.push(currentUser);
        updatedPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
        
        // Update ranks
        updatedPlayers.forEach((player, index) => {
          player.rank = index + 1;
        });

        setPlayers(updatedPlayers);
      } else {
        setPlayers(mockPlayers);
      }
    };

    generateMockData();
  }, [publicKey, timeFrame, category]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return { icon: "solar:crown-bold", color: "text-yellow-400" };
      case 2: return { icon: "solar:medal-star-bold", color: "text-gray-300" };
      case 3: return { icon: "solar:medal-star-bold", color: "text-orange-400" };
      default: return { icon: "solar:user-bold", color: "text-gray-400" };
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: "from-yellow-500 to-orange-500",
        2: "from-gray-400 to-gray-600", 
        3: "from-orange-500 to-red-500"
      };
      return `bg-gradient-to-r ${colors[rank as keyof typeof colors]}`;
    }
    return "bg-gray-700";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon icon="solar:arrow-left-bold" className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-gray-400">Compete with other learners globally</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Frame Filter */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
          <h3 className="text-white font-semibold mb-3">Time Frame</h3>
          <div className="flex space-x-2">
            {[
              { key: "weekly", label: "This Week" },
              { key: "monthly", label: "This Month" },
              { key: "allTime", label: "All Time" }
            ].map((frame) => (
              <button
                key={frame.key}
                onClick={() => setTimeFrame(frame.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeFrame === frame.key
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
                }`}
              >
                {frame.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
          <h3 className="text-white font-semibold mb-3">Category</h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="overall">Overall Rankings</option>
            <option value="blockchain-basics">Blockchain Basics</option>
            <option value="solana-fundamentals">Solana Fundamentals</option>
            <option value="defi-protocols">DeFi Protocols</option>
            <option value="nft-tokens">NFTs & Tokens</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Top Performers</h2>
        <div className="flex justify-center items-end space-x-4 mb-8">
          {players.slice(0, 3).map((player, index) => {
            const position = [1, 0, 2][index]; // 2nd, 1st, 3rd visual order
            const heights = ["h-24", "h-32", "h-20"];
            const actualPlayer = players.find(p => p.rank === position + 1);
            
            if (!actualPlayer) return null;

            return (
              <div key={actualPlayer.id} className="text-center">
                <div className="mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${getRankBadge(actualPlayer.rank)} flex items-center justify-center mb-2`}>
                    <Icon icon={getRankIcon(actualPlayer.rank).icon} className={`text-2xl ${getRankIcon(actualPlayer.rank).color}`} />
                  </div>
                  <div className="text-white font-semibold">{actualPlayer.displayName}</div>
                  <div className="text-gray-400 text-sm">{actualPlayer.totalPoints.toLocaleString()} pts</div>
                </div>
                <div className={`${heights[position]} w-20 mx-auto ${getRankBadge(actualPlayer.rank)} rounded-t-lg flex items-end justify-center pb-2`}>
                  <span className="text-white font-bold text-lg">#{actualPlayer.rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)]">
        <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl font-bold text-white">Rankings</h2>
        </div>

        <div className="divide-y divide-[rgba(255,255,255,0.1)]">
          {players.map((player, index) => (
            <div 
              key={player.id}
              className={`p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors ${
                player.isCurrentUser ? "bg-purple-500/10 border-l-4 border-purple-500" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full ${getRankBadge(player.rank)} flex items-center justify-center`}>
                    <span className="text-white font-bold">#{player.rank}</span>
                  </div>

                  {/* Player Info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${player.isCurrentUser ? "text-purple-400" : "text-white"}`}>
                        {player.displayName}
                      </span>
                      {player.isCurrentUser && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">YOU</span>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {player.address.slice(0, 4)}...{player.address.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <div className="text-white font-semibold">{player.totalPoints.toLocaleString()}</div>
                    <div className="text-gray-400 text-xs">Points</div>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Lv.{player.level}</div>
                    <div className="text-gray-400 text-xs">Level</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-white font-semibold">{player.streak}</div>
                    <div className="text-gray-400 text-xs">Streak</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-white font-semibold">{player.averageScore}%</div>
                    <div className="text-gray-400 text-xs">Avg Score</div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-white font-semibold">{player.nftsClaimed}</div>
                    <div className="text-gray-400 text-xs">NFTs</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-[rgba(255,255,255,0.1)] p-8 text-center">
        <Icon icon="solar:trophy-bold" className="text-yellow-400 text-4xl mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">Climb the Rankings!</h3>
        <p className="text-gray-400 mb-6">
          Complete more quizzes and improve your scores to rise in the leaderboard
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setCurrentView("quiz")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Take Quiz
          </button>
          <button
            onClick={() => setCurrentView("tutor")}
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
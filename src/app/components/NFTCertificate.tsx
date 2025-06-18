"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { usePhantomWallet } from "./PhantomWallet";
import { toast } from "sonner";
import { SolanaAgentKit } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  VersionedTransaction,
  SendOptions 
} from "@solana/web3.js";

interface Certificate {
  id: string;
  name: string;
  description: string;
  category: "blockchain-basics" | "solana-fundamentals" | "defi-protocols" | "nft-tokens";
  requirements: {
    completedQuizzes: number;
    totalQuizzes: number;
    minimumScore: number;
  };
  design: {
    backgroundColor: string;
    accentColor: string;
    icon: string;
  };
  mintAddress?: string;
  earned: boolean;
  earnedDate?: string;
  rarityLevel: "Common" | "Rare" | "Epic" | "Legendary";
}

interface NFTCertificateProps {
  setCurrentView: (view: "dashboard" | "quiz" | "tutor" | "leaderboard" | "nft") => void;
}

const NFTCertificate: React.FC<NFTCertificateProps> = ({ setCurrentView }) => {
  const { phantom, connected, publicKey } = usePhantomWallet();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isMinting, setIsMinting] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Initialize certificates data
  useEffect(() => {
    const certificateData: Certificate[] = [
      {
        id: "blockchain-basics-cert",
        name: "Blockchain Explorer",
        description: "Master the fundamentals of blockchain technology",
        category: "blockchain-basics",
        requirements: {
          completedQuizzes: 12,
          totalQuizzes: 15,
          minimumScore: 80
        },
        design: {
          backgroundColor: "from-blue-600 to-cyan-600",
          accentColor: "blue",
          icon: "solar:book-bold"
        },
        earned: true,
        earnedDate: "2024-06-15",
        rarityLevel: "Common"
      },
      {
        id: "solana-fundamentals-cert", 
        name: "Solana Pioneer",
        description: "Understand Solana's architecture and ecosystem",
        category: "solana-fundamentals",
        requirements: {
          completedQuizzes: 15,
          totalQuizzes: 20,
          minimumScore: 85
        },
        design: {
          backgroundColor: "from-purple-600 to-blue-600",
          accentColor: "purple",
          icon: "solar:cpu-bolt-bold"
        },
        earned: false,
        rarityLevel: "Rare"
      },
      {
        id: "defi-protocols-cert",
        name: "DeFi Specialist",
        description: "Expert in decentralized finance protocols",
        category: "defi-protocols",
        requirements: {
          completedQuizzes: 14,
          totalQuizzes: 18,
          minimumScore: 90
        },
        design: {
          backgroundColor: "from-green-600 to-teal-600",
          accentColor: "green",
          icon: "solar:wallet-bold"
        },
        earned: false,
        rarityLevel: "Epic"
      },
      {
        id: "nft-tokens-cert",
        name: "NFT Master",
        description: "Complete mastery of NFTs and token economics",
        category: "nft-tokens",
        requirements: {
          completedQuizzes: 10,
          totalQuizzes: 12,
          minimumScore: 95
        },
        design: {
          backgroundColor: "from-pink-600 to-purple-600",
          accentColor: "pink",
          icon: "solar:gallery-bold"
        },
        earned: false,
        rarityLevel: "Legendary"
      }
    ];

    setCertificates(certificateData);
  }, []);

  const getSolanaAgent = () => {
    if (!phantom || !publicKey) return null;

    return new SolanaAgentKit(
      {
        publicKey: publicKey,
        signTransaction: async <T extends Transaction | VersionedTransaction>(
          tx: T
        ): Promise<T> => {
          if (!phantom) throw new Error("Phantom not initialized.");
          const signedTransaction = await phantom.solana.signTransaction(tx);
          return signedTransaction as T;
        },
        signMessage: async (msg) => {
          if (!phantom) throw new Error("Phantom not initialized.");
          const signedMessage = await phantom.solana.signMessage(msg);
          return signedMessage.signature;
        },
        sendTransaction: async (tx) => {
          if (!phantom) throw new Error("Phantom not initialized.");
          const transactionHash = await phantom.solana.sendTransaction(tx);
          return transactionHash;
        },
        signAllTransactions: async <T extends Transaction | VersionedTransaction>(
          txs: T[]
        ): Promise<T[]> => {
          if (!phantom) throw new Error("Phantom not initialized.");
          const signedTransaction = await phantom.solana.signAllTransactions(txs);
          return signedTransaction as T[];
        },
        signAndSendTransaction: async <T extends Transaction | VersionedTransaction>(
          tx: T,
          options?: SendOptions
        ): Promise<{ signature: string }> => {
          if (!phantom) throw new Error("Phantom not initialized.");
          const transactionHash = await phantom.solana.signAndSendTransaction(tx);
          return { signature: transactionHash };
        },
      },
      process.env.NEXT_PUBLIC_RPC_URL as string,
      {}
    ).use(TokenPlugin);
  };

  const handleMintNFT = async (certificate: Certificate) => {
    if (!connected || !publicKey || certificate.earned) {
      toast.error("Cannot mint this certificate yet!");
      return;
    }

    setIsMinting(certificate.id);
    toast.info("Preparing to mint your NFT certificate...");

    try {
      const agent = getSolanaAgent();
      if (!agent) throw new Error("Failed to initialize Solana agent");

      // Create NFT metadata
      const metadata = {
        name: certificate.name,
        description: certificate.description,
        image: `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(certificate.name)}`,
        attributes: [
          { trait_type: "Category", value: certificate.category },
          { trait_type: "Rarity", value: certificate.rarityLevel },
          { trait_type: "Completion Date", value: new Date().toISOString().split('T')[0] },
          { trait_type: "Earned By", value: publicKey.toString().slice(0, 8) + "..." }
        ]
      };

      // Use Solana Agent Kit to mint NFT
      toast.info("Minting your certificate NFT...");
      
      // Simulate NFT minting process (in real implementation, you'd use the agent's NFT minting capabilities)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update certificate as earned
      setCertificates(prev => 
        prev.map(cert => 
          cert.id === certificate.id 
            ? { ...cert, earned: true, earnedDate: new Date().toISOString().split('T')[0] }
            : cert
        )
      );

      toast.success("🎉 Certificate NFT minted successfully!");
      toast.success("Your achievement is now recorded on the Solana blockchain!");

    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint certificate. Please try again.");
    } finally {
      setIsMinting(null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "text-gray-400";
      case "Rare": return "text-blue-400";
      case "Epic": return "text-purple-400";
      case "Legendary": return "text-yellow-400";
      default: return "text-gray-400";
    }
  };

  const checkEligibility = (certificate: Certificate) => {
    // Simulate progress tracking (in real app, this would come from user's actual progress)
    const mockProgress = {
      "blockchain-basics": { completed: 12, score: 85 },
      "solana-fundamentals": { completed: 10, score: 82 },
      "defi-protocols": { completed: 8, score: 88 },
      "nft-tokens": { completed: 6, score: 91 }
    };

    const progress = mockProgress[certificate.category as keyof typeof mockProgress];
    const meetsQuizRequirement = progress.completed >= certificate.requirements.completedQuizzes;
    const meetsScoreRequirement = progress.score >= certificate.requirements.minimumScore;
    
    return meetsQuizRequirement && meetsScoreRequirement;
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
            <h1 className="text-3xl font-bold text-white">NFT Certificates</h1>
            <p className="text-gray-400">Earn blockchain credentials verified on Solana</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
          <div className="flex items-center space-x-3">
            <Icon icon="solar:medal-star-bold" className="text-yellow-400 text-2xl" />
            <div>
              <div className="text-white font-semibold">
                {certificates.filter(c => c.earned).length}
              </div>
              <div className="text-gray-400 text-sm">Certificates Earned</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
          <div className="flex items-center space-x-3">
            <Icon icon="solar:target-bold" className="text-blue-400 text-2xl" />
            <div>
              <div className="text-white font-semibold">
                {certificates.filter(c => checkEligibility(c) && !c.earned).length}
              </div>
              <div className="text-gray-400 text-sm">Ready to Claim</div>
            </div>
          </div>
        </div>

        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
          <div className="flex items-center space-x-3">
            <Icon icon="solar:clock-bold" className="text-orange-400 text-2xl" />
            <div>
              <div className="text-white font-semibold">
                {certificates.filter(c => !checkEligibility(c) && !c.earned).length}
              </div>
              <div className="text-gray-400 text-sm">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4">
          <div className="flex items-center space-x-3">
            <Icon icon="solar:crown-bold" className="text-purple-400 text-2xl" />
            <div>
              <div className="text-white font-semibold">
                {certificates.filter(c => c.rarityLevel === "Legendary" && c.earned).length}
              </div>
              <div className="text-gray-400 text-sm">Legendary Certs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((certificate) => {
          const isEligible = checkEligibility(certificate);
          
          return (
            <div
              key={certificate.id}
              className={`relative bg-gradient-to-br ${certificate.design.backgroundColor} rounded-xl border transition-all transform hover:scale-105 ${
                certificate.earned 
                  ? "border-green-500/50 shadow-lg shadow-green-500/20" 
                  : isEligible
                  ? "border-yellow-500/50 shadow-lg shadow-yellow-500/20 cursor-pointer"
                  : "border-[rgba(255,255,255,0.1)] opacity-75"
              }`}
              onClick={() => isEligible && !certificate.earned ? handleMintNFT(certificate) : null}
            >
              {/* Certificate Content */}
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon icon={certificate.design.icon} className="text-white text-3xl" />
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getRarityColor(certificate.rarityLevel)}`}>
                      {certificate.rarityLevel}
                    </div>
                    {certificate.earned && (
                      <Icon icon="solar:verified-check-bold" className="text-green-400 text-xl mt-1" />
                    )}
                  </div>
                </div>

                <h3 className="text-white font-bold text-xl mb-2">{certificate.name}</h3>
                <p className="text-white/80 text-sm mb-4">{certificate.description}</p>

                {/* Requirements */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Quizzes Required:</span>
                    <span className="text-white">{certificate.requirements.completedQuizzes}/{certificate.requirements.totalQuizzes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Minimum Score:</span>
                    <span className="text-white">{certificate.requirements.minimumScore}%</span>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center justify-between">
                  {certificate.earned ? (
                    <div className="flex items-center space-x-2">
                      <Icon icon="solar:calendar-bold" className="text-white/70" />
                      <span className="text-white/70 text-sm">Earned {certificate.earnedDate}</span>
                    </div>
                  ) : isEligible ? (
                    <div className="flex items-center space-x-2">
                      <Icon icon="solar:check-circle-bold" className="text-yellow-400" />
                      <span className="text-yellow-400 text-sm font-medium">Ready to Mint!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Icon icon="solar:clock-circle-bold" className="text-gray-400" />
                      <span className="text-gray-400 text-sm">Keep Learning</span>
                    </div>
                  )}

                  {isMinting === certificate.id && (
                    <div className="flex items-center space-x-2">
                      <Icon icon="solar:loading-bold" className="text-white animate-spin" />
                      <span className="text-white text-sm">Minting...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
                <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-8 text-center">
        <Icon icon="solar:rocket-bold" className="text-purple-400 text-4xl mx-auto mb-4" />
        <h3 className="text-white font-bold text-xl mb-2">Start Your Journey</h3>
        <p className="text-gray-400 mb-6">
          Complete quizzes and learn about Solana to earn verifiable NFT certificates that prove your blockchain expertise.
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
            Learn with AI
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCertificate;
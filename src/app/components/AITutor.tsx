"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { marked } from "marked";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { myProvider } from "../utils/provider";
import { generateText, type CoreMessage } from "ai";
import { SolanaAgentKit, createVercelAITools } from "solana-agent-kit";
import { Buffer } from "buffer";
import {
  Connection,
  PublicKey,
  sendAndConfirmRawTransaction,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import { usePhantomWallet } from "./PhantomWallet";
import { useTranslation } from "../hooks/useTranslation";
import Image from "next/image";

interface AITutorProps {
  setCurrentView: (view: "dashboard" | "quiz" | "tutor" | "leaderboard" | "nft") => void;
}

const AITutor: React.FC<AITutorProps> = ({ setCurrentView }) => {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tutorMode, setTutorMode] = useState<"general" | "beginner" | "advanced">("general");
  const { phantom, connected, publicKey } = usePhantomWallet();
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: t("aiTutor.welcomeMessage")
        }
      ]);
    }
  }, [messages.length, t]);

  const solanaTools = useMemo(() => {
    if (phantom) {
      const wallet = publicKey;
      const agent = new SolanaAgentKit(
        {
          publicKey: wallet!,
          signTransaction: async (transaction: any): Promise<any> => {
            if (!phantom) throw new Error("Phantom not initialized.");
            const signedTransaction = await phantom.solana.signTransaction(transaction);
            return signedTransaction;
          },
          signMessage: async (msg) => {
            if (!phantom) throw new Error("Phantom not initialized.");
            const signedMessage = await phantom.solana.signMessage(msg);
            return signedMessage.signature;
          },
          sendTransaction: async (transaction: any) => {
            if (!phantom) throw new Error("Phantom not initialized.");
            const transactionHash = await phantom.solana.sendTransaction(transaction);
            return transactionHash;
          },
          signAllTransactions: async (transactions: any[]): Promise<any[]> => {
            if (!phantom) throw new Error("Phantom not initialized.");
            const signedTransactions = await phantom.solana.signAllTransactions(transactions);
            return signedTransactions;
          },
          signAndSendTransaction: async (
            transaction: any,
            options?: any
          ): Promise<{ signature: string }> => {
            if (!phantom) throw new Error("Phantom not initialized.");
            const transactionHash = await phantom.solana.signAndSendTransaction(transaction);
            return { signature: transactionHash };
          },
        },
        process.env.NEXT_PUBLIC_RPC_URL as string,
        {}
      ).use(TokenPlugin);

      const tools = createVercelAITools(agent, agent.actions);
      return tools;
    }
  }, [phantom, publicKey]);

  const getTutorSystemPrompt = (mode: string) => {
    const basePrompt = `You are an expert Solana blockchain educator and AI tutor specializing in gamified learning. Your role is to:

1. **Provide clear, engaging explanations** of Solana concepts
2. **Create personalized quizzes** when requested
3. **Guide hands-on learning** with practical examples
4. **Encourage progress** with positive reinforcement
5. **Adapt to the user's level** and learning pace

**Current Learning Mode: ${mode.toUpperCase()}**`;

    const modePrompts = {
      beginner: `
**BEGINNER MODE:** Focus on:
- Basic blockchain concepts (blocks, transactions, wallets)
- What makes Solana unique (speed, low fees, PoH)
- Simple analogies and real-world examples
- Fundamental terminology
- Encourage questions and provide gentle guidance`,

      general: `
**GENERAL MODE:** Cover:
- Solana architecture and consensus mechanism
- SPL tokens, NFTs, and DeFi protocols
- Development basics with Rust and JavaScript
- Popular dApps and use cases
- Balance theory with practical applications`,

      advanced: `
**ADVANCED MODE:** Deep dive into:
- Solana program development and deployment
- Cross-program invocations and PDAs
- Performance optimization and account structure
- Advanced DeFi protocols and composability
- Security best practices and auditing`
    };

    return basePrompt + (modePrompts[mode as keyof typeof modePrompts] || modePrompts.general) + `

**Teaching Style:**
- Use emojis and formatting for engagement
- Break complex topics into digestible parts
- Provide code examples when relevant
- Create interactive quiz questions when requested
- Reward progress and effort
- Connect concepts to real-world applications

**Quiz Generation Guidelines:**
When creating quizzes:
- Match the current learning mode difficulty
- Include 4 multiple choice options (A, B, C, D)
- Provide immediate feedback and explanations
- Track conceptual understanding
- Suggest next topics based on performance

You can interact with the Solana blockchain using your tools when demonstrations are helpful for learning.`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: CoreMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await generateText({
        model: myProvider.languageModel("chat-model"),
        messages: updatedMessages,
        system: getTutorSystemPrompt(tutorMode),
        maxSteps: 5,
        tools: solanaTools,
      });

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: result.text || "I'm having trouble processing that. Could you try rephrasing your question?",
        },
      ]);
    } catch (error) {
      console.error("AI Tutor error:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "I'm experiencing some technical difficulties. Please try again in a moment! 🤖",
        },
      ]);
    }

    setIsLoading(false);
  };

  const quickQuestions = t("aiTutor.questions") as string[];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon icon="solar:arrow-left-bold" className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{t("aiTutor.title")}</h1>
            <p className="text-gray-400">{t("aiTutor.subtitle")}</p>
          </div>
        </div>

        {/* Learning Mode Selector */}
        <div className="flex space-x-2">
          {[
            { key: "beginner", label: t("aiTutor.modes.beginner"), color: "from-green-500 to-emerald-500" },
            { key: "general", label: t("aiTutor.modes.general"), color: "from-blue-500 to-cyan-500" },
            { key: "advanced", label: t("aiTutor.modes.advanced"), color: "from-red-500 to-pink-500" }
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setTutorMode(mode.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tutorMode === mode.key
                  ? `bg-gradient-to-r ${mode.color} text-white`
                  : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)]"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Questions Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-4 sticky top-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Icon icon="solar:lightbulb-bold" className="mr-2" />
              {t("aiTutor.quickQuestions")}
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)] rounded-lg transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] h-[calc(100vh-200px)] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`${
                      m.role === "user" 
                        ? "bg-purple-600 rounded-lg" 
                        : "bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"
                    } flex items-center justify-center w-10 h-10`}>
                      {m.role === "user" ? (
                        <Icon icon="solar:user-bold" className="text-white text-lg" />
                      ) : (
                        <Icon icon="solar:brain-bold" className="text-white text-lg" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-400 mr-2">
                        {m.role === "user" ? t("aiTutor.you") : t("aiTutor.aiTutor")}
                      </span>
                      <span className="text-xs text-gray-500">{getCurrentTime()}</span>
                    </div>

                    <div className={`prose prose-sm max-w-none ${
                      m.role === "user" 
                        ? "text-gray-200" 
                        : "text-white prose-headings:text-white prose-strong:text-white prose-code:text-purple-300 prose-code:bg-purple-900/30"
                    }`}>
                      {typeof m.content === "string" ? (
                        <div dangerouslySetInnerHTML={{ __html: marked(m.content) }} />
                      ) : (
                        "[Unsupported content]"
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-[rgba(255,255,255,0.1)] p-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder={t("aiTutor.placeholder")}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())
                    }
                    disabled={isLoading}
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Icon icon="solar:loading-bold" className="text-xl animate-spin" />
                  ) : (
                    <Icon icon="solar:paper-plane-bold" className="text-xl" />
                  )}
                </button>
              </div>
              
              <div className="text-center text-gray-400 text-xs mt-3">
                {t("aiTutor.poweredBy")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
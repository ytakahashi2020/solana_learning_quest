"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import { usePhantomWallet } from "./PhantomWallet";
import { toast } from "sonner";
import { generateText } from "ai";
import { myProvider } from "../utils/provider";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  points: number;
}

interface QuizArenaProps {
  setCurrentView: (view: "dashboard" | "quiz" | "tutor" | "leaderboard" | "nft") => void;
}

const QuizArena: React.FC<QuizArenaProps> = ({ setCurrentView }) => {
  const { connected, publicKey } = usePhantomWallet();
  const [gameMode, setGameMode] = useState<"select" | "playing" | "results">("select");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const categories = [
    {
      id: "blockchain-basics",
      name: "Blockchain Basics",
      icon: "solar:book-bold",
      color: "from-blue-500 to-cyan-500",
      description: "Fundamental concepts of blockchain technology"
    },
    {
      id: "solana-fundamentals", 
      name: "Solana Fundamentals",
      icon: "solar:cpu-bolt-bold",
      color: "from-purple-500 to-blue-500",
      description: "Core Solana architecture and features"
    },
    {
      id: "defi-protocols",
      name: "DeFi Protocols",
      icon: "solar:wallet-bold",
      color: "from-green-500 to-teal-500",
      description: "Decentralized finance and protocols"
    },
    {
      id: "nft-tokens",
      name: "NFTs & Tokens",
      icon: "solar:gallery-bold", 
      color: "from-pink-500 to-purple-500",
      description: "Non-fungible tokens and tokenomics"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameMode === "playing" && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameMode === "playing" && !showExplanation) {
      handleAnswerSubmit();
    }
  }, [timeLeft, gameMode, showExplanation, handleAnswerSubmit]);

  const generateQuizQuestions = async (category: string, difficulty: string) => {
    setIsGenerating(true);
    
    const categoryDescriptions = {
      "blockchain-basics": "fundamental blockchain concepts, cryptography, consensus mechanisms, and basic principles",
      "solana-fundamentals": "Solana architecture, Proof of History, validators, programs, accounts, and ecosystem",
      "defi-protocols": "decentralized finance, AMMs, liquidity pools, yield farming, lending protocols",
      "nft-tokens": "non-fungible tokens, token standards, marketplaces, and tokenomics"
    };

    const prompt = `Generate 5 multiple choice quiz questions about ${categoryDescriptions[category as keyof typeof categoryDescriptions]} for ${difficulty} level.

Format as JSON array with this exact structure:
[
  {
    "question": "Clear question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of correct answer",
    "points": ${difficulty === "beginner" ? 10 : difficulty === "intermediate" ? 20 : 30}
  }
]

Make questions challenging but fair for ${difficulty} level. Ensure explanations are educational and helpful.`;

    try {
      const result = await generateText({
        model: myProvider.languageModel("chat-model"),
        prompt,
        temperature: 0.7,
      });

      // Parse the JSON response
      const questionsData = JSON.parse(result.text);
      const formattedQuestions: QuizQuestion[] = questionsData.map((q: any, index: number) => ({
        id: `${category}-${difficulty}-${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        category: category,
        points: q.points
      }));

      setQuestions(formattedQuestions);
      setGameMode("playing");
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setScore(0);
      setTimeLeft(30);
      setSelectedAnswer(null);
      setShowExplanation(false);

    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
      
      // Fallback to sample questions
      const fallbackQuestions: QuizQuestion[] = [
        {
          id: "sample-1",
          question: "What is the main advantage of Solana's Proof of History?",
          options: [
            "Lower energy consumption",
            "Faster transaction processing",
            "Better smart contract capabilities", 
            "Higher decentralization"
          ],
          correctAnswer: 1,
          explanation: "Proof of History allows Solana to achieve faster transaction processing by providing a cryptographic timestamp, eliminating the need for nodes to communicate about time.",
          difficulty: difficulty,
          category: category,
          points: 20
        }
      ];
      
      setQuestions(fallbackQuestions);
      setGameMode("playing");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setScore(score + questions[currentQuestionIndex].points);
        toast.success("Correct! 🎉");
      } else {
        toast.error("Incorrect ❌");
      }
    } else {
      // Time ran out
      setAnswers([...answers, -1]);
      toast.error("Time&apos;s up! ⏰");
    }

    setShowExplanation(true);
  }, [selectedAnswer, answers, questions, currentQuestionIndex, score]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
      setShowExplanation(false);
    } else {
      setGameMode("results");
    }
  };

  const calculateGrade = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const percentage = (correctAnswers / questions.length) * 100;
    
    if (percentage >= 90) return { grade: "A+", color: "text-green-400", message: "Outstanding!" };
    if (percentage >= 80) return { grade: "A", color: "text-green-300", message: "Excellent!" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-400", message: "Good job!" };
    if (percentage >= 60) return { grade: "C", color: "text-yellow-400", message: "Keep learning!" };
    return { grade: "F", color: "text-red-400", message: "Try again!" };
  };

  const resetQuiz = () => {
    setGameMode("select");
    setSelectedCategory("");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Category Selection Screen
  if (gameMode === "select") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-3xl font-bold text-white">Quiz Arena</h1>
              <p className="text-gray-400">Test your Solana knowledge and earn points</p>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Select Difficulty</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "beginner", label: "Beginner", color: "from-green-500 to-emerald-500", points: "10 pts/question" },
              { key: "intermediate", label: "Intermediate", color: "from-blue-500 to-cyan-500", points: "20 pts/question" },
              { key: "advanced", label: "Advanced", color: "from-red-500 to-pink-500", points: "30 pts/question" }
            ].map((diff) => (
              <button
                key={diff.key}
                onClick={() => setSelectedDifficulty(diff.key as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedDifficulty === diff.key
                    ? `bg-gradient-to-r ${diff.color} border-transparent text-white`
                    : "border-[rgba(255,255,255,0.1)] text-gray-300 hover:border-purple-500/50"
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{diff.label}</div>
                  <div className="text-sm mt-1">{diff.points}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Selection */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <h2 className="text-xl font-bold text-white mb-4">Select Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-br ${category.color} border-transparent text-white`
                    : "border-[rgba(255,255,255,0.1)] text-gray-300 hover:border-purple-500/50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 ${selectedCategory === category.id ? 'bg-white/20' : `bg-gradient-to-r ${category.color}`} rounded-lg flex items-center justify-center`}>
                    <Icon icon={category.icon} className="text-2xl text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm opacity-80">{category.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Quiz Button */}
        <div className="text-center">
          <button
            onClick={() => generateQuizQuestions(selectedCategory, selectedDifficulty)}
            disabled={!selectedCategory || isGenerating}
            className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isGenerating ? "animate-pulse" : ""
            }`}
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <Icon icon="solar:loading-bold" className="animate-spin" />
                <span>Generating Quiz...</span>
              </div>
            ) : (
              "Start Quiz Challenge"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  if (gameMode === "playing" && currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={resetQuiz}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="solar:close-circle-bold" className="text-xl" />
              </button>
              <div>
                <h2 className="text-white font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                <p className="text-gray-400 text-sm capitalize">{selectedCategory.replace('-', ' ')} • {selectedDifficulty}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">Score: {score}</div>
              <div className={`text-sm ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                Time: {timeLeft}s
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-8">
          <h3 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  showExplanation
                    ? index === currentQuestion.correctAnswer
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : selectedAnswer === index
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "border-gray-600 text-gray-400"
                    : selectedAnswer === index
                    ? "bg-purple-500/20 border-purple-500 text-white"
                    : "border-[rgba(255,255,255,0.1)] text-gray-300 hover:border-purple-500/50 hover:text-white"
                }`}
              >
                <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="text-blue-400 font-semibold mb-2">Explanation:</h4>
              <p className="text-gray-300">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            {!showExplanation ? (
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "View Results"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameMode === "results") {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const { grade, color, message } = calculateGrade();
    const percentage = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Quiz Complete!</h1>
          <p className="text-gray-400">Here&apos;s how you performed</p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-[rgba(255,255,255,0.1)] p-8 text-center">
          <div className={`text-6xl font-bold ${color} mb-4`}>{grade}</div>
          <div className="text-3xl font-bold text-white mb-2">{score} Points</div>
          <div className="text-xl text-gray-300 mb-4">{correctAnswers}/{questions.length} Correct ({percentage}%)</div>
          <div className={`text-lg font-semibold ${color}`}>{message}</div>
        </div>

        {/* Question Review */}
        <div className="bg-[#20242D] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
          <h3 className="text-white font-semibold mb-4">Question Review</h3>
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={question.id} className="flex items-center justify-between p-4 rounded-lg bg-[rgba(255,255,255,0.05)]">
                  <div className="flex-1">
                    <p className="text-white text-sm">{question.question}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-sm">+{question.points} pts</span>
                    {isCorrect ? (
                      <Icon icon="solar:check-circle-bold" className="text-green-400 text-xl" />
                    ) : (
                      <Icon icon="solar:close-circle-bold" className="text-red-400 text-xl" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => setCurrentView("dashboard")}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizArena;
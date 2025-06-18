import { useState, useEffect } from 'react';

interface TranslationData {
  [key: string]: any;
}

const translations: { [locale: string]: TranslationData } = {
  en: {
    homepage: {
      title: "SolanaLearningQuest",
      subtitle: "Master Solana Blockchain Through AI-Powered Gaming",
      features: {
        aiLearning: {
          title: "AI-Powered Learning",
          description: "Personalized learning paths with intelligent tutoring"
        },
        gamified: {
          title: "Gamified Experience",
          description: "Learn through interactive quizzes and challenges"
        },
        nftCerts: {
          title: "NFT Certificates",
          description: "Earn verifiable blockchain credentials"
        }
      },
      cta: {
        connectAndStart: "Connect Wallet & Start",
        enterGame: "Enter Game",
        connecting: "Connecting...",
        poweredBy: "Powered by Phantom Wallet • Solana Blockchain"
      }
    },
    game: {
      dashboard: {
        title: "Dashboard",
        welcome: "Welcome back, {address}!",
        subtitle: "Ready to continue your Solana learning journey?",
        learningCategories: "Learning Categories",
        achievements: "Achievements",
        quickActions: "Quick Actions",
        categories: {
          basics: {
            name: "Blockchain Basics",
            completed: "{completed} / {total} completed"
          },
          solana: {
            name: "Solana Fundamentals",
            completed: "{completed} / {total} completed"
          },
          defi: {
            name: "DeFi Protocols",
            completed: "{completed} / {total} completed"
          },
          nft: {
            name: "NFT & Tokens",
            completed: "{completed} / {total} completed"
          }
        },
        stats: {
          level: "Level {level}",
          explorer: "Explorer",
          progress: "Progress",
          points: "Points",
          learningCredits: "Learning Credits",
          streak: "Streak",
          dailyLearning: "Daily Learning",
          globalRank: "Global Rank",
          leaderboard: "Leaderboard",
          keepItUp: "Keep it up!",
          today: "+{points} today",
          viewLeaderboard: "View leaderboard →"
        },
        actions: {
          chatWithAI: "Chat with AI Tutor",
          startQuiz: "Start Quiz Challenge",
          viewNFTs: "View NFT Certificates",
          viewLeaderboard: "View Leaderboard"
        },
        achievementDetails: {
          firstSteps: {
            name: "First Steps",
            description: "Complete your first quiz",
            earned: "Earned {date}"
          },
          weekWarrior: {
            name: "Week Warrior", 
            description: "7-day learning streak",
            progress: "Progress: {current} / {target}"
          },
          perfectMind: {
            name: "Perfect Mind",
            description: "Score 100% on any quiz",
            earned: "Earned {date}"
          },
          blockchainMaster: {
            name: "Blockchain Master",
            description: "Complete all basic courses",
            progress: "Progress: {current} / {target}"
          }
        }
      },
      quiz: {
        title: "Quiz Arena"
      },
      tutor: {
        title: "AI Tutor"
      },
      leaderboard: {
        title: "Leaderboard"
      },
      nft: {
        title: "NFT Certificates"
      }
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "Compete with other learners globally",
      timeFrame: "Time Frame",
      thisWeek: "This Week",
      thisMonth: "This Month", 
      allTime: "All Time",
      category: "Category",
      overallRankings: "Overall Rankings",
      blockchainBasics: "Blockchain Basics",
      solanaFundamentals: "Solana Fundamentals",
      defiProtocols: "DeFi Protocols",
      nftsTokens: "NFTs & Tokens",
      topPerformers: "Top Performers",
      rankings: "Rankings",
      points: "Points",
      level: "Level",
      streak: "Streak",
      avgScore: "Avg Score",
      nfts: "NFTs",
      you: "YOU",
      climbRankings: "Climb the Rankings!",
      climbDescription: "Complete more quizzes and improve your scores to rise in the leaderboard",
      takeQuiz: "Take Quiz",
      learnMore: "Learn More"
    },
    quiz: {
      title: "Quiz Arena",
      subtitle: "Test your Solana knowledge and earn points",
      selectDifficulty: "Select Difficulty",
      selectCategory: "Select Category",
      beginner: "Beginner",
      intermediate: "Intermediate", 
      advanced: "Advanced",
      points10: "10 pts/question",
      points20: "20 pts/question",
      points30: "30 pts/question",
      startQuizChallenge: "Start Quiz Challenge",
      generatingQuiz: "Generating Quiz...",
      quizComplete: "Quiz Complete!",
      howYouPerformed: "Here's how you performed",
      outstanding: "Outstanding!",
      excellent: "Excellent!",
      goodJob: "Good job!",
      keepLearning: "Keep learning!",
      tryAgain: "Try again!",
      questionReview: "Question Review",
      takeAnotherQuiz: "Take Another Quiz",
      backToDashboard: "Back to Dashboard",
      categories: {
        blockchainBasics: {
          name: "Blockchain Basics",
          description: "Learn fundamental blockchain concepts and cryptography"
        },
        solanaFundamentals: {
          name: "Solana Fundamentals", 
          description: "Master Solana's unique features and architecture"
        },
        defiProtocols: {
          name: "DeFi Protocols",
          description: "Explore decentralized finance on Solana"
        },
        nftTokens: {
          name: "NFT & Tokens",
          description: "Understand digital assets and token standards"
        }
      }
    },
    nftCertificate: {
      title: "NFT Certificates",
      subtitle: "Earn blockchain credentials verified on Solana",
      certificatesEarned: "Certificates Earned",
      readyToClaim: "Ready to Claim",
      inProgress: "In Progress", 
      legendaryCerts: "Legendary Certs",
      startJourney: "Start Your Journey",
      journeyDescription: "Complete quizzes and learn about Solana to earn verifiable NFT certificates that prove your blockchain expertise.",
      certificates: {
        blockchainExplorer: {
          name: "Blockchain Explorer",
          description: "Master the fundamentals of blockchain technology"
        },
        solanaPioneer: {
          name: "Solana Pioneer",
          description: "Demonstrate expertise in Solana ecosystem"
        },
        defiSpecialist: {
          name: "DeFi Specialist", 
          description: "Proven knowledge in decentralized finance"
        },
        nftMaster: {
          name: "NFT Master",
          description: "Expert in digital assets and NFT technology"
        }
      }
    },
    aiTutor: {
      title: "AI Solana Tutor",
      subtitle: "Your personal blockchain learning companion",
      welcomeMessage: "🎯 **Welcome to your AI Solana Tutor!**\n\nI'm here to help you master Solana blockchain technology. You can ask me anything about:\n\n🔷 **Blockchain Fundamentals** - Basic concepts, cryptography, consensus\n🔷 **Solana Architecture** - Proof of History, validators, clusters\n🔷 **Smart Contracts** - Program development, Anchor framework\n🔷 **DeFi Protocols** - DEXs, lending, yield farming\n🔷 **NFTs & Tokens** - Token standards, marketplaces, minting\n\nChoose your learning level and let's start your journey!",
      modes: {
        beginner: "Beginner",
        general: "General",
        advanced: "Advanced"
      },
      quickQuestions: "Quick Questions",
      you: "You",
      aiTutor: "AI Tutor",
      placeholder: "Ask me anything about Solana, or request a quiz...",
      poweredBy: "Press Enter to send • Shift+Enter for new line • Powered by OpenAI & Solana Agent Kit"
    },
    navigation: {
      dashboard: "Dashboard",
      aiTutor: "AI Tutor", 
      quizArena: "Quiz Arena",
      nftCertificates: "NFT Certificates",
      leaderboard: "Leaderboard"
    },
    character: {
      levels: {
        1: "Novice Explorer",
        2: "Curious Learner",
        3: "Blockchain Student", 
        4: "Crypto Enthusiast",
        5: "Solana Apprentice",
        6: "DeFi Discoverer",
        7: "Smart Contract Scholar",
        8: "Protocol Pioneer",
        9: "Blockchain Architect",
        10: "Solana Master"
      },
      growth: {
        levelUp: "Level Up!",
        newAbilities: "You've unlocked new abilities!",
        characterEvolved: "Your character has evolved!"
      }
    }
  },
  ja: {
    homepage: {
      title: "SolanaLearningQuest",
      subtitle: "AIパワードゲーミングでSolanaブロックチェーンをマスター",
      features: {
        aiLearning: {
          title: "AI学習システム",
          description: "インテリジェントな個人指導による学習パス"
        },
        gamified: {
          title: "ゲーミフィケーション",
          description: "インタラクティブなクイズとチャレンジで学習"
        },
        nftCerts: {
          title: "NFT認定証",
          description: "検証可能なブロックチェーン資格を獲得"
        }
      },
      cta: {
        connectAndStart: "ウォレット接続＆開始",
        enterGame: "ゲーム開始",
        connecting: "接続中...",
        poweredBy: "Phantom Wallet • Solana ブロックチェーン対応"
      }
    },
    game: {
      dashboard: {
        title: "ダッシュボード",
        welcome: "おかえりなさい、{address}さん！",
        subtitle: "Solana学習の旅を続ける準備はできていますか？", 
        learningCategories: "学習カテゴリ",
        achievements: "実績",
        quickActions: "クイックアクション",
        categories: {
          basics: {
            name: "ブロックチェーン基礎",
            completed: "{completed} / {total} 完了"
          },
          solana: {
            name: "Solana基礎",
            completed: "{completed} / {total} 完了"
          },
          defi: {
            name: "DeFiプロトコル",
            completed: "{completed} / {total} 完了"
          },
          nft: {
            name: "NFT・トークン",
            completed: "{completed} / {total} 完了"
          }
        },
        stats: {
          level: "レベル{level}",
          explorer: "エクスプローラー",
          progress: "進行状況",
          points: "ポイント",
          learningCredits: "学習クレジット",
          streak: "連続記録",
          dailyLearning: "日次学習",
          globalRank: "世界ランク",
          leaderboard: "リーダーボード",
          keepItUp: "この調子で頑張って！",
          today: "今日+{points}",
          viewLeaderboard: "リーダーボードを見る →"
        },
        actions: {
          chatWithAI: "AIチューターとチャット",
          startQuiz: "クイズチャレンジ開始",
          viewNFTs: "NFT認定証を見る",
          viewLeaderboard: "リーダーボードを見る"
        },
        achievementDetails: {
          firstSteps: {
            name: "はじめの一歩",
            description: "初回クイズ完了",
            earned: "{date} 獲得"
          },
          weekWarrior: {
            name: "一週間の戦士",
            description: "7日間学習継続",
            progress: "進捗: {current} / {target}"
          },
          perfectMind: {
            name: "完璧な心",
            description: "クイズで100%獲得",
            earned: "{date} 獲得"
          },
          blockchainMaster: {
            name: "ブロックチェーンマスター",
            description: "基礎コース全完了",
            progress: "進捗: {current} / {target}"
          }
        }
      },
      quiz: {
        title: "クイズアリーナ"
      },
      tutor: {
        title: "AIチューター"
      },
      leaderboard: {
        title: "リーダーボード"
      },
      nft: {
        title: "NFT認定証"
      }
    },
    leaderboard: {
      title: "リーダーボード",
      subtitle: "世界中の学習者と競争しよう",
      timeFrame: "期間",
      thisWeek: "今週",
      thisMonth: "今月",
      allTime: "全期間",
      category: "カテゴリ",
      overallRankings: "総合ランキング",
      blockchainBasics: "ブロックチェーン基礎",
      solanaFundamentals: "Solana基礎",
      defiProtocols: "DeFiプロトコル",
      nftsTokens: "NFT・トークン",
      topPerformers: "トップパフォーマー",
      rankings: "ランキング",
      points: "ポイント",
      level: "レベル",
      streak: "連続記録",
      avgScore: "平均スコア",
      nfts: "NFT",
      you: "あなた",
      climbRankings: "ランキングを上がろう！",
      climbDescription: "より多くのクイズを完了し、スコアを向上させてリーダーボードで上位を目指しましょう",
      takeQuiz: "クイズに挑戦",
      learnMore: "詳しく学ぶ"
    },
    quiz: {
      title: "クイズアリーナ",
      subtitle: "Solanaの知識をテストしてポイントを獲得",
      selectDifficulty: "難易度選択",
      selectCategory: "カテゴリ選択",
      beginner: "初級",
      intermediate: "中級",
      advanced: "上級",
      points10: "10ポイント/問",
      points20: "20ポイント/問",
      points30: "30ポイント/問",
      startQuizChallenge: "クイズチャレンジ開始",
      generatingQuiz: "クイズ生成中...",
      quizComplete: "クイズ完了！",
      howYouPerformed: "あなたの成績です",
      outstanding: "素晴らしい！",
      excellent: "優秀！",
      goodJob: "よくできました！",
      keepLearning: "学習を続けよう！",
      tryAgain: "再挑戦！",
      questionReview: "問題レビュー",
      takeAnotherQuiz: "別のクイズに挑戦",
      backToDashboard: "ダッシュボードに戻る",
      categories: {
        blockchainBasics: {
          name: "ブロックチェーン基礎",
          description: "基本的なブロックチェーン概念と暗号技術を学ぶ"
        },
        solanaFundamentals: {
          name: "Solana基礎",
          description: "Solanaの独自機能とアーキテクチャをマスター"
        },
        defiProtocols: {
          name: "DeFiプロトコル",
          description: "Solana上の分散型金融を探索"
        },
        nftTokens: {
          name: "NFT・トークン",
          description: "デジタル資産とトークン標準を理解"
        }
      }
    },
    nftCertificate: {
      title: "NFT認定証",
      subtitle: "Solanaで検証されたブロックチェーン資格を獲得",
      certificatesEarned: "取得した認定証",
      readyToClaim: "受け取り可能",
      inProgress: "進行中",
      legendaryCerts: "レジェンダリー認定証",
      startJourney: "旅を始めよう",
      journeyDescription: "クイズを完了しSolanaについて学んで、あなたのブロックチェーン専門知識を証明する検証可能なNFT認定証を獲得しましょう。",
      certificates: {
        blockchainExplorer: {
          name: "ブロックチェーンエクスプローラー",
          description: "ブロックチェーン技術の基礎をマスター"
        },
        solanaPioneer: {
          name: "Solanaパイオニア",
          description: "Solanaエコシステムの専門知識を実証"
        },
        defiSpecialist: {
          name: "DeFiスペシャリスト",
          description: "分散型金融における実証された知識"
        },
        nftMaster: {
          name: "NFTマスター",
          description: "デジタル資産とNFT技術のエキスパート"
        }
      }
    },
    aiTutor: {
      title: "AI Solanaチューター",
      subtitle: "あなた専用のブロックチェーン学習コンパニオン",
      welcomeMessage: "🎯 **AI Solanaチューターへようこそ！**\n\nSolanaブロックチェーン技術をマスターするお手伝いをします。以下について何でもお聞きください：\n\n🔷 **ブロックチェーン基礎** - 基本概念、暗号技術、コンセンサス\n🔷 **Solanaアーキテクチャ** - Proof of History、バリデーター、クラスター\n🔷 **スマートコントラクト** - プログラム開発、Anchorフレームワーク\n🔷 **DeFiプロトコル** - DEX、レンディング、イールドファーミング\n🔷 **NFT・トークン** - トークン標準、マーケットプレイス、ミンティング\n\n学習レベルを選択して、あなたの学習の旅を始めましょう！",
      modes: {
        beginner: "初級",
        general: "一般",
        advanced: "上級"
      },
      quickQuestions: "クイック質問",
      you: "あなた",
      aiTutor: "AIチューター",
      placeholder: "Solanaについて何でも聞いてください、またはクイズをリクエストしてください...",
      poweredBy: "Enterで送信 • Shift+Enterで改行 • OpenAI & Solana Agent Kit 提供"
    },
    navigation: {
      dashboard: "ダッシュボード",
      aiTutor: "AIチューター",
      quizArena: "クイズアリーナ", 
      nftCertificates: "NFT認定証",
      leaderboard: "リーダーボード"
    },
    character: {
      levels: {
        1: "初心者エクスプローラー",
        2: "好奇心旺盛な学習者",
        3: "ブロックチェーン学生",
        4: "暗号愛好家", 
        5: "Solana見習い",
        6: "DeFi発見者",
        7: "スマートコントラクト研究者",
        8: "プロトコルパイオニア",
        9: "ブロックチェーンアーキテクト",
        10: "Solanaマスター"
      },
      growth: {
        levelUp: "レベルアップ！",
        newAbilities: "新しい能力を解放しました！",
        characterEvolved: "キャラクターが進化しました！"
      }
    }
  }
};

export const useTranslation = () => {
  const [locale, setLocale] = useState<'en' | 'ja'>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as 'en' | 'ja';
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ja')) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: 'en' | 'ja') => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (path: string, variables?: { [key: string]: string | number }) => {
    const keys = path.split('.');
    let value: any = translations[locale];
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    // デバッグ: オブジェクトが返される場合はパスを返す
    if (typeof value === 'object' && value !== null) {
      console.warn(`Translation key "${path}" returned an object:`, value);
      return path;
    }
    
    if (typeof value === 'string' && variables) {
      return value.replace(/\{(\w+)\}/g, (match, key) => {
        return variables[key]?.toString() || match;
      });
    }
    
    return value || path;
  };

  return { t, locale, changeLocale };
};
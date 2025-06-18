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
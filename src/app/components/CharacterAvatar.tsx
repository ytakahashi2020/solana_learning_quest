"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from '../hooks/useTranslation';

interface CharacterAvatarProps {
  level: number;
  experience: number;
  emotion?: "neutral" | "happy" | "thinking" | "excited" | "confused" | "celebrating";
  size?: "small" | "medium" | "large";
  showLevelUp?: boolean;
  onLevelUpComplete?: () => void;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  level,
  experience,
  emotion = "neutral",
  size = "medium",
  showLevelUp = false,
  onLevelUpComplete
}) => {
  const { t } = useTranslation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(emotion);

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24", 
    large: "w-32 h-32"
  };

  const getEmotionIcon = (emotion: string) => {
    const emotionIcons = {
      happy: "solar:smile-circle-bold",
      thinking: "solar:question-circle-bold", 
      excited: "solar:star-circle-bold",
      confused: "solar:question-square-bold",
      celebrating: "solar:confetti-bold",
      neutral: "solar:user-circle-bold"
    };
    return emotionIcons[emotion as keyof typeof emotionIcons] || "solar:user-circle-bold";
  };

  const getCharacterTitle = (level: number) => {
    return t(`character.levels.${level}`) || `Level ${level}`;
  };

  // レベルアップアニメーション
  useEffect(() => {
    if (showLevelUp) {
      setIsAnimating(true);
      setCurrentEmotion("celebrating");
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setCurrentEmotion("happy");
        onLevelUpComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showLevelUp, onLevelUpComplete]);

  // 感情の変化をアニメーション
  useEffect(() => {
    if (!showLevelUp) {
      setCurrentEmotion(emotion);
    }
  }, [emotion, showLevelUp]);

  return (
    <div className="relative flex flex-col items-center">
      {/* レベルアップエフェクト */}
      {showLevelUp && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="animate-bounce bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            {t('character.growth.levelUp')}
          </div>
        </div>
      )}

      {/* キャラクター画像 */}
      <div className={`relative ${sizeClasses[size]} ${isAnimating ? 'animate-pulse' : ''}`}>
        {/* メインキャラクター */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30 overflow-hidden flex items-center justify-center">
          {/* プレースホルダーキャラクター */}
          <div className="flex flex-col items-center justify-center text-center">
            <Icon icon="solar:user-bold" className="text-purple-400 text-4xl mb-1" />
            <span className="text-purple-300 text-xs font-bold">Lv.{level}</span>
          </div>
          
          {/* 感情オーバーレイ */}
          {currentEmotion !== "neutral" && (
            <div className="absolute top-0 right-0 w-6 h-6 transform translate-x-1 -translate-y-1 bg-green-500/80 rounded-full border border-white shadow-sm flex items-center justify-center">
              <Icon 
                icon={getEmotionIcon(currentEmotion)} 
                className="text-white text-xs"
              />
            </div>
          )}
        </div>

        {/* レベル表示 */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg">
          Lv.{level}
        </div>

        {/* パーティクルエフェクト */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* キャラクター情報 */}
      {size !== "small" && (
        <div className="mt-2 text-center">
          <div className="text-white font-semibold text-sm">
            {getCharacterTitle(level)}
          </div>
          {size === "large" && (
            <div className="text-gray-400 text-xs mt-1">
              {experience} XP
            </div>
          )}
        </div>
      )}

      {/* 成長メッセージ */}
      {showLevelUp && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 bg-black/80 text-white text-xs p-2 rounded-lg text-center animate-fade-in-up">
          {t('character.growth.characterEvolved')}
        </div>
      )}
    </div>
  );
};

export default CharacterAvatar;
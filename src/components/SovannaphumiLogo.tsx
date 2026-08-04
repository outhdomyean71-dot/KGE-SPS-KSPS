import React, { useState } from 'react';
import { SOVANNAPHUMI_LOGO_DATA_URL } from '../assets/sovannaphumiLogo';

interface SovannaphumiLogoProps {
  className?: string;
  size?: number;
}

export const SovannaphumiLogo: React.FC<SovannaphumiLogoProps> = ({
  className = "w-12 h-12",
  size = 48
}) => {
  const [imgError, setImgError] = useState(false);

  if (SOVANNAPHUMI_LOGO_DATA_URL && !imgError) {
    return (
      <img
        src={SOVANNAPHUMI_LOGO_DATA_URL}
        alt="Sovannaphumi School Logo"
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`object-contain rounded-full shrink-0 drop-shadow-md ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-md ${className}`}
    >
      <defs>
        {/* Outer Ring Gold Gradient */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* Center Shield/Circle Gradient */}
        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#115e59" />
        </linearGradient>

        {/* Book / Accent Gold */}
        <linearGradient id="bookGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Torch Flame Gradient */}
        <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
      </defs>

      {/* Outer Golden Border Circle */}
      <circle cx="50" cy="50" r="48" fill="url(#goldGradient)" />
      
      {/* Inner Decorative Golden Ring */}
      <circle cx="50" cy="50" r="44" fill="#78350f" />
      <circle cx="50" cy="50" r="42" fill="url(#centerGradient)" />

      {/* Dashed Gold Decorative Outer Ring */}
      <circle cx="50" cy="50" r="45" stroke="#fef08a" strokeWidth="0.75" strokeDasharray="2 1.5" fill="none" opacity="0.8" />

      {/* Khmer Crown / Temple Peak Motif top ornament */}
      <path
        d="M50 12 L54 20 L50 17 L46 20 Z"
        fill="url(#bookGold)"
      />
      <circle cx="50" cy="11" r="1.5" fill="#fef08a" />

      {/* Laurel Wreath Leaves (Left Side) */}
      <g fill="url(#bookGold)" opacity="0.9">
        <path d="M22 45 C19 38 21 30 25 24 C23 29 24 36 27 41 Z" />
        <path d="M20 56 C17 49 18 42 22 36 C21 42 22 49 26 53 Z" />
        <path d="M22 67 C19 60 21 53 26 47 C24 53 26 60 29 64 Z" />
      </g>

      {/* Laurel Wreath Leaves (Right Side) */}
      <g fill="url(#bookGold)" opacity="0.9">
        <path d="M78 45 C81 38 79 30 75 24 C77 29 76 36 73 41 Z" />
        <path d="M80 56 C83 49 82 42 78 36 C79 42 78 49 74 53 Z" />
        <path d="M78 67 C81 60 79 53 74 47 C76 53 74 60 71 64 Z" />
      </g>

      {/* Open Knowledge Book */}
      <g fill="none" stroke="url(#bookGold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Left Page */}
        <path d="M50 66 C42 61 32 62 26 65 L26 44 C32 41 42 40 50 45 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Right Page */}
        <path d="M50 66 C58 61 68 62 74 65 L74 44 C68 41 58 40 50 45 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
        {/* Spine line */}
        <line x1="50" y1="45" x2="50" y2="66" stroke="#d97706" strokeWidth="2" />
      </g>

      {/* Book Text lines */}
      <path d="M30 48 H44 M30 53 H42 M30 58 H44" stroke="#0d9488" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <path d="M56 48 H70 M58 53 H70 M56 58 H70" stroke="#0d9488" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />

      {/* Torch of Knowledge above the book */}
      <path d="M48 42 L52 42 L51 46 L49 46 Z" fill="#f59e0b" />
      {/* Torch Base Handle */}
      <path d="M50 46 L50 51" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      {/* Flame */}
      <path d="M50 25 C54 30 55 35 50 41 C45 35 46 30 50 25 Z" fill="url(#flameGrad)" />
      <path d="M50 29 C52 32 53 35 50 39 C47 35 48 32 50 29 Z" fill="#fef08a" />

      {/* 3 Golden Achievement Stars */}
      <polygon points="50,19 51.5,22 55,22 52,24 53,27.5 50,25.5 47,27.5 48,24 45,22 48.5,22" fill="#fef08a" />
      <polygon points="38,24 39.2,26.5 42,26.5 39.7,28 40.5,31 38,29.5 35.5,31 36.3,28 34,26.5 36.8,26.5" fill="#fef08a" opacity="0.9" />
      <polygon points="62,24 63.2,26.5 66,26.5 63.7,28 64.5,31 62,29.5 59.5,31 60.3,28 58,26.5 60.8,26.5" fill="#fef08a" opacity="0.9" />

      {/* Sovannaphumi Khmer Banner at bottom */}
      <path
        d="M24 73 C38 78 62 78 76 73 L73 80 C58 84 42 84 27 80 Z"
        fill="url(#goldGradient)"
        stroke="#78350f"
        strokeWidth="0.5"
      />
      {/* Banner Ribbons left/right */}
      <path d="M24 73 L18 78 L25 80 Z" fill="#d97706" />
      <path d="M76 73 L82 78 L75 80 Z" fill="#d97706" />

      {/* Khmer Text or Accent on Banner */}
      <circle cx="36" cy="76.5" r="1" fill="#78350f" />
      <circle cx="50" cy="77" r="1.2" fill="#78350f" />
      <circle cx="64" cy="76.5" r="1" fill="#78350f" />
    </svg>
  );
};

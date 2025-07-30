import React from 'react';

const pots = {
  empty: (
    <svg
      width="150"
      height="150"
      viewBox="0 0 64 64" // Maintain your original viewBox
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soil / Inner Top of Pot */}
      <rect x="20" y="32" width="24" height="4" rx="2" fill="#8B4513" stroke="#663300" strokeWidth="0.5" /> {/* Darker brown for soil */}

      {/* Pot Main Body - Base Shape */}
      {/* Using a path for a slightly tapered shape for more realism */}
      <path
        d="M18 36 C16 38, 16 52, 18 54 L46 54 C48 52, 48 38, 46 36 L18 36 Z"
        fill="#CD853F" // Terracotta color
        stroke="#A0522D" // Slightly darker terracotta for stroke
        strokeWidth="1"
      />

      {/* Pot Rim */}
      <rect x="16" y="34" width="32" height="4" rx="1.5" fill="#DEB887" stroke="#A0522D" strokeWidth="1" /> {/* Lighter beige for rim */}
      {/* Small highlight on the rim */}
      <rect x="17" y="34.5" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" />


      {/* Subtle Shadow on Pot Body */}
      <path
        d="M32 36 C30 38, 30 52, 32 54 L46 54 C48 52, 48 38, 46 36 L32 36 Z"
        fill="rgba(0,0,0,0.1)" // Soft shadow
      />

      {/* Subtle Highlight on Pot Body */}
      <path
        d="M18 36 C16 38, 16 52, 18 54 L32 54 L32 36 L18 36 Z"
        fill="rgba(255,255,255,0.08)" // Soft highlight
      />

      {/* Optional: Simple texture lines */}
      <line x1="28" y1="40" x2="28" y2="50" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="36" y1="38" x2="36" y2="48" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />

    </svg>
  ),

  sprout: (
    <svg
      width="150"
      height="150"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Re-use the aesthetic pot from 'empty' */}
      <rect x="20" y="32" width="24" height="4" rx="2" fill="#8B4513" stroke="#663300" strokeWidth="0.5" />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L46 54 C48 52, 48 38, 46 36 L18 36 Z"
        fill="#CD853F" stroke="#A0522D" strokeWidth="1"
      />
      <rect x="16" y="34" width="32" height="4" rx="1.5" fill="#DEB887" stroke="#A0522D" strokeWidth="1" />
      <rect x="17" y="34.5" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" />
      <path
        d="M32 36 C30 38, 30 52, 32 54 L46 54 C48 52, 48 38, 46 36 L32 36 Z"
        fill="rgba(0,0,0,0.1)"
      />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L32 54 L32 36 L18 36 Z"
        fill="rgba(255,255,255,0.08)"
      />
      <line x1="28" y1="40" x2="28" y2="50" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="36" y1="38" x2="36" y2="48" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Sprout on top of the soil */}
      <path
        d="M32 32 C30 27, 28 22, 32 20"
        stroke="#6B8E23" // A nice green
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round" // Rounded ends for lines
      />
      <circle cx="32" cy="20" r="2.5" fill="#8BC34A" /> {/* Lighter green for sprout tip */}
    </svg>
  ),

  growing: (
    <svg
      width="150"
      height="150"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Re-use the aesthetic pot from 'empty' */}
      <rect x="20" y="32" width="24" height="4" rx="2" fill="#8B4513" stroke="#663300" strokeWidth="0.5" />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L46 54 C48 52, 48 38, 46 36 L18 36 Z"
        fill="#CD853F" stroke="#A0522D" strokeWidth="1"
      />
      <rect x="16" y="34" width="32" height="4" rx="1.5" fill="#DEB887" stroke="#A0522D" strokeWidth="1" />
      <rect x="17" y="34.5" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" />
      <path
        d="M32 36 C30 38, 30 52, 32 54 L46 54 C48 52, 48 38, 46 36 L32 36 Z"
        fill="rgba(0,0,0,0.1)"
      />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L32 54 L32 36 L18 36 Z"
        fill="rgba(255,255,255,0.08)"
      />
      <line x1="28" y1="40" x2="28" y2="50" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="36" y1="38" x2="36" y2="48" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Growing stem */}
      <path
        d="M32 32 V15" // Vertical stem
        stroke="#6B8E23"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M32 25 Q25 20, 28 15" // Left leaf
        stroke="#8BC34A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M32 25 Q39 20, 36 15" // Right leaf
        stroke="#8BC34A"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="32" cy="15" r="3" fill="#6B8E23" /> {/* Top bud/growth point */}
    </svg>
  ),

  // NEW STAGE: Bud (for 75% completion)
  bud: (
    <svg
      width="150"
      height="150"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pot (re-used) */}
      <rect x="20" y="32" width="24" height="4" rx="2" fill="#8B4513" stroke="#663300" strokeWidth="0.5" />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L46 54 C48 52, 48 38, 46 36 L18 36 Z"
        fill="#CD853F" stroke="#A0522D" strokeWidth="1"
      />
      <rect x="16" y="34" width="32" height="4" rx="1.5" fill="#DEB887" stroke="#A0522D" strokeWidth="1" />
      <rect x="17" y="34.5" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" />
      <path
        d="M32 36 C30 38, 30 52, 32 54 L46 54 C48 52, 48 38, 46 36 L32 36 Z"
        fill="rgba(0,0,0,0.1)"
      />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L32 54 L32 36 L18 36 Z"
        fill="rgba(255,255,255,0.08)"
      />
      <line x1="28" y1="40" x2="28" y2="50" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="36" y1="38" x2="36" y2="48" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Stem and Leaves */}
      <path d="M32 32 V12" stroke="#3CB371" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 22 Q19 18, 24 10" stroke="#3CB371" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M36 22 Q45 18, 40 10" stroke="#3CB371" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Flower Bud - clearly formed but not fully open */}
      <g transform="translate(0, -1)"> {/* Slight vertical adjustment */}
        <circle cx="32" cy="11" r="7" fill="#FF69B4" stroke="#FF1493" strokeWidth="1" /> {/* Main bud shape (hot pink) */}
        <path d="M32 6 Q30 8, 28 10 L32 11 Z" fill="#FFB6C1" opacity="0.8"/> {/* Hint of opening petal 1 */}
        <path d="M32 6 Q34 8, 36 10 L32 11 Z" fill="#FFB6C1" opacity="0.8"/> {/* Hint of opening petal 2 */}
        <path d="M26 12 Q28 10, 30 9 L32 11 Z" fill="#FFB6C1" opacity="0.8"/> {/* Hint of opening petal 3 */}
        <path d="M38 12 Q36 10, 34 9 L32 11 Z" fill="#FFB6C1" opacity="0.8"/> {/* Hint of opening petal 4 */}

        {/* Small vibrant center just peeking */}
        <circle cx="32" cy="11" r="2.5" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5"/>
      </g>
    </svg>
  ),

  // FULL BLOOM STAGE (for 100% completion) - now distinct from bud
  bloom: (
    <svg
      width="150"
      height="150"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Re-use the aesthetic pot from 'empty' */}
      <rect x="20" y="32" width="24" height="4" rx="2" fill="#8B4513" stroke="#663300" strokeWidth="0.5" />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L46 54 C48 52, 48 38, 46 36 L18 36 Z"
        fill="#CD853F" stroke="#A0522D" strokeWidth="1"
      />
      <rect x="16" y="34" width="32" height="4" rx="1.5" fill="#DEB887" stroke="#A0522D" strokeWidth="1" />
      <rect x="17" y="34.5" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)" />
      <path
        d="M32 36 C30 38, 30 52, 32 54 L46 54 C48 52, 48 38, 46 36 L32 36 Z"
        fill="rgba(0,0,0,0.1)"
      />
      <path
        d="M18 36 C16 38, 16 52, 18 54 L32 54 L32 36 L18 36 Z"
        fill="rgba(255,255,255,0.08)"
      />
      <line x1="28" y1="40" x2="28" y2="50" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />
      <line x1="36" y1="38" x2="36" y2="48" stroke="#A0522D" strokeWidth="0.5" strokeOpacity="0.2" />

      {/* Full Bloom Flower - more vibrant and "open" than the bud */}
      <g transform="translate(0, -2)"> {/* Shift flower slightly up for more space */}
        <path d="M32 32 V7" stroke="#228B22" strokeWidth="3.5" strokeLinecap="round" /> {/* Stronger, darker stem */}
        {/* Fuller leaves */}
        <path d="M28 20 Q16 16, 22 8" stroke="#3CB371" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M36 20 Q48 16, 42 8" stroke="#3CB371" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Main flower head - a more rounded, full shape */}
        {/* Layer 1: Darker Pink Petals (background) */}
        <circle cx="32" cy="11" r="10" fill="#FF1493" /> {/* Dark Pink */}
        <circle cx="32" cy="11" r="8" fill="#FF69B4" />  {/* Hot Pink */}

        {/* Layer 2: Lighter Pink Petals (foreground) */}
        {/* Using a series of circles for a full, layered look */}
        <circle cx="32" cy="5" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Top */}
        <circle cx="37" cy="7" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Top-Right */}
        <circle cx="39" cy="12" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Mid-Right */}
        <circle cx="37" cy="17" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Bottom-Right */}
        <circle cx="32" cy="19" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Bottom */}
        <circle cx="27" cy="17" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Bottom-Left */}
        <circle cx="25" cy="12" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Mid-Left */}
        <circle cx="27" cy="7" r="5" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="0.5"/> {/* Top-Left */}


        {/* Flower Center - More defined and vibrant */}
        <circle cx="32" cy="12" r="4.5" fill="#FFD700" stroke="#FFA500" strokeWidth="0.75" /> {/* Gold center */}
        <circle cx="32" cy="12" r="2" fill="#FFFF00" /> {/* Bright yellow highlight in center */}
      </g>
    </svg>
  ),
};

export default pots;
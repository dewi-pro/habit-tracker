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

      {/* Blooming flower with more detail */}
      <path d="M32 32 V10" stroke="#6B8E23" strokeWidth="3" strokeLinecap="round" /> {/* Main stem */}
      <path d="M28 22 Q20 18, 25 10" stroke="#8BC34A" strokeWidth="2.5" fill="none" strokeLinecap="round" /> {/* Left leaf */}
      <path d="M36 22 Q44 18, 39 10" stroke="#8BC34A" strokeWidth="2.5" fill="none" strokeLinecap="round" /> {/* Right leaf */}


      {/* Flower petals (using paths for more organic shape) */}
      <path d="M32 10 L30 5 Q32 2, 34 5 L32 10 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" /> {/* Top petal */}
      <path d="M28 12 L24 8 Q21 12, 24 16 L28 12 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" /> {/* Top-left petal */}
      <path d="M36 12 L40 8 Q43 12, 40 16 L36 12 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" /> {/* Top-right petal */}
      <path d="M32 14 L30 19 Q32 22, 34 19 L32 14 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" /> {/* Bottom petal */}
      <path d="M26 16 L22 20 Q19 16, 22 12 L26 16 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" /> {/* Bottom-left petal */}
      <path d="M38 16 L42 20 Q45 16, 42 12 L38 16 Z" fill="#FFD700" stroke="#FFA500" strokeWidth="0.5" /> {/* Bottom-right petal */}


      <circle cx="32" cy="12" r="3" fill="#FF8C00" /> {/* Flower center (darker orange) */}

    </svg>
  ),
};

export default pots;
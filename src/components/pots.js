import React from 'react';

const pots = {
  empty: (
    <svg
      width="150"
      height="150"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pot base */}
      <rect x="14" y="40" width="36" height="16" fill="#A0522D" />
      {/* Pot upper part */}
      <rect x="22" y="30" width="20" height="12" fill="#DEB887" />
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
      {/* Pot base */}
      <rect x="14" y="40" width="36" height="16" fill="#A0522D" />
      {/* Pot upper part */}
      <rect x="22" y="30" width="20" height="12" fill="#DEB887" />
      {/* Small sprout */}
      <path
        d="M32 30 C30 25, 28 20, 32 18"
        stroke="green"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="32" cy="18" r="3" fill="green" />
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
      {/* Pot base */}
      <rect x="14" y="40" width="36" height="16" fill="#A0522D" />
      {/* Pot upper part */}
      <rect x="22" y="30" width="20" height="12" fill="#DEB887" />
      {/* Growing stem */}
      <path
        d="M32 30 C28 20, 26 10, 32 8"
        stroke="green"
        strokeWidth="4"
        fill="none"
      />
      {/* Leaves */}
      <path
        d="M28 15 Q26 12, 30 10"
        stroke="green"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M36 15 Q38 12, 34 10"
        stroke="green"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="32" cy="8" r="4" fill="green" />
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
      {/* Pot base */}
      <rect x="14" y="40" width="36" height="16" fill="#A0522D" />
      {/* Pot upper part */}
      <rect x="22" y="30" width="20" height="12" fill="#DEB887" />
      {/* Blooming flower */}
      <circle cx="32" cy="15" r="6" fill="orange" />
      {/* Petals */}
      <path
        d="M32 9 L30 3 L34 3 L32 9"
        fill="orange"
        stroke="darkorange"
        strokeWidth="1"
      />
      <path
        d="M26 15 L20 13 L24 17 L26 15"
        fill="orange"
        stroke="darkorange"
        strokeWidth="1"
      />
      <path
        d="M38 15 L44 13 L40 17 L38 15"
        fill="orange"
        stroke="darkorange"
        strokeWidth="1"
      />
      <path
        d="M32 21 L30 27 L34 27 L32 21"
        fill="orange"
        stroke="darkorange"
        strokeWidth="1"
      />
      {/* Stem */}
      <path d="M32 30 L32 20" stroke="green" strokeWidth="3" />
      {/* Leaves */}
      <path
        d="M28 25 Q26 22, 30 20"
        stroke="green"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M36 25 Q38 22, 34 20"
        stroke="green"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  ),
};

export default pots;

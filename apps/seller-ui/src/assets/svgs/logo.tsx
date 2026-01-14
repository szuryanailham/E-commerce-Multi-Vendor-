import React from 'react';

const Logo = ({ size = 40 }: { size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bag */}
      <rect
        x="10"
        y="18"
        width="44"
        height="36"
        rx="6"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />

      {/* Handle */}
      <path
        d="M22 18C22 12 26 8 32 8C38 8 42 12 42 18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Letter E */}
      <path
        d="M26 30H38M26 38H36M26 46H38"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;

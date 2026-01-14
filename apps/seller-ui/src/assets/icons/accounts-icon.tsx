import React from 'react';

const AccountsIcon = ({ fill = 'currentColor' }: { fill?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="12" cy="8" r="4" stroke={fill} strokeWidth="1.8" />

      {/* Body */}
      <path
        d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AccountsIcon;

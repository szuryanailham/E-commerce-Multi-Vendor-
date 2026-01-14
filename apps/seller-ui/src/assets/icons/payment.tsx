import React from 'react';

const Payment = ({
  fill = 'currentColor',
  size = 20,
}: {
  fill?: string;
  size?: number;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Card */}
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="3"
        stroke={fill}
        strokeWidth="1.8"
      />

      {/* Top stripe */}
      <path d="M2 9H22" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />

      {/* Chip */}
      <rect
        x="6"
        y="12"
        width="4"
        height="3"
        rx="0.8"
        stroke={fill}
        strokeWidth="1.5"
      />

      {/* Lines */}
      <path
        d="M12 13H18"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Payment;

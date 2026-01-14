import React from 'react';

const ListOrderedIcon = ({
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
      {/* Check */}
      <path
        d="M3 6L5 8L9 4"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* First line */}
      <path
        d="M11 6H21"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Second row */}
      <path d="M3 12H9" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11 12H21"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Third row */}
      <path d="M3 18H9" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M11 18H21"
        stroke={fill}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default ListOrderedIcon;

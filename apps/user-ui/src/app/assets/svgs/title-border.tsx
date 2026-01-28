import React from 'react';

type TitleBorderProps = React.SVGProps<SVGSVGElement>;

const TitleBorder: React.FC<TitleBorderProps> = ({ className, ...props }) => {
  return (
    <svg
      width="200"
      height="20"
      viewBox="0 0 200 20"
      className={`mx-auto ${className ?? ''}`}
      fill="none"
      {...props}
    >
      <path
        d="M0 10 Q 25 5, 50 10 T 100 10 T 150 10 T 200 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default TitleBorder;

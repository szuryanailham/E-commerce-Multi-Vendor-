import React from 'react';

const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20.8 4.6C19.6 3.2 17.4 2.8 15.8 4C14.9 4.6 14.3 5.5 14 6.5C13.7 5.5 13.1 4.6 12.2 4C10.6 2.8 8.4 3.2 7.2 4.6C5.8 6.2 6 8.6 7.6 10.2L14 16.5L20.4 10.2C22 8.6 22.2 6.2 20.8 4.6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HeartIcon;

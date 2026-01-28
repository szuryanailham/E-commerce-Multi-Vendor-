import React from 'react';
interface SectionTitleProps {
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <div className="relative inline-block">
      <h1 className="relative z-10 md:text-3xl text-xl font-semibold text-center">
        {title}
      </h1>
      {/* <TitleBorder className="absolute left-1/2 top-[55%] -translate-x-1/2 text-primary" /> */}
    </div>
  );
};

export default SectionTitle;

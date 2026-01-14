import Link from 'next/link';
import React from 'react';

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href: string;
}

const SidebarItem = ({ icon, title, isActive, href }: Props) => {
  return (
    <Link href={href} className="block my-1">
      <div
        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition cursor-pointer
        ${
          isActive
            ? 'bg-[#0f3158] scale-[0.98] full-blue-200 hover:!bg-[#0f3158d6]'
            : 'text-slate-400 hover:bg-[#2b2f31] hover:text-white'
        }`}
      >
        <div className="flex items-center justify-center">{icon}</div>
        <span className="text-sm font-medium">{title}</span>
      </div>
    </Link>
  );
};

export default SidebarItem;

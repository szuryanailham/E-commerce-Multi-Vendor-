import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="mt-6">
      <h3 className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </h3>

      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

export default SidebarMenu;

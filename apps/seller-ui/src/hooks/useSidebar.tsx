'use client';
import { activeSidebarBarItem } from '@/config/constants';
import { useAtom } from 'jotai';

const useSidebar = () => {
  const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarBarItem);
  return { activeSidebar, setActiveSidebar };
};

export default useSidebar;

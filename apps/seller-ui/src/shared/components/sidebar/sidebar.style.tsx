'use client';
import styled from 'styled-components';

export const SidebarWrapper = styled.div<{ $open?: boolean }>`
  background-color: var(--background);
  height: 100vh;
  width: 16rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 202;
  display: flex;
  flex-direction: column;
  transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.25s ease-in-out;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
`;

export const Header = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  font-size: 1.1rem;

  /* posisi */
  display: flex;
  align-items: center; /* vertical center */
  justify-content: flex-start; /* kiri */

  /* pastikan full width sidebar */
  width: 100%;
`;

export const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

export const Footer = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const Overlay = styled.div<{ $open?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 201;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

export const Sidebar = {
  Wrapper: SidebarWrapper,
  Header,
  Body,
  Overlay,
  Footer,
};

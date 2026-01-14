'use client';
import useSeller from '@/hooks/useSeller';
import useSidebar from '@/hooks/useSidebar';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Box from '../ui/box';
import { Sidebar } from './sidebar.style';
import Link from 'next/link';
import Logo from '@/assets/svgs/logo';
import SidebarItem from './sidebar.item';
import Home from '@/assets/icons/home';
import SidebarMenu from './sidebar.menu';
import Payment from '@/assets/icons/payment';
import ListOrderedIcon from '@/assets/icons/listOrdered';
import {
  BellRing,
  Boxes,
  CalendarPlus,
  CalendarRange,
  LogOut,
  Mail,
  Settings,
  SquarePlus,
  TicketPercent,
} from 'lucide-react';
const SidebarWrapper = () => {
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();
  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: String) =>
    activeSidebar === route ? '#0085ff' : '#969696';

  return (
    <Box
      css={{
        height: '100vh',
        zIndex: 202,
        position: 'sticky',
        padding: '8px',
        top: '0',
        overflow: 'scroll',
        scrollbarWidth: 'none',
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header className="px-4 py-5 border-b border-white/10">
        <Box className="flex flex-col gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-90 transition"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Logo size={20} />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm uppercase tracking-wide text-white/60">
                Platform
              </span>
              <span className="font-semibold text-lg text-white">E-Shop</span>
            </div>
          </Link>

          {/* Shop Info */}
          <Box>
            <h3 className="text-xl font-medium text-[#ecedee]">
              {seller?.shop?.name}
            </h3>
            <h5 className="font-medium text-xs text-[#ecedeecf]  whitespace-nowrap overflow-hidden text-ellipsis max-w-[1700px]">
              {seller?.shop?.address}
            </h5>
          </Box>
        </Box>
      </Sidebar.Header>
      <div className="block my-3">
        <Sidebar.Body>
          <SidebarItem
            title="Dashboard"
            href="/dashboard"
            isActive={activeSidebar === '/dashboard'}
            icon={<Home size={24} fill={getIconColor('/dashboard')} />}
          />

          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                href="/dashboard/orders"
                isActive={activeSidebar === '/dashboard/orders'}
                icon={
                  <ListOrderedIcon
                    size={24}
                    fill={getIconColor('/dashboard/orders')}
                  />
                }
              />

              <SidebarItem
                title="Payments"
                href="/dashboard/payments"
                isActive={activeSidebar === '/dashboard/payments'}
                icon={
                  <Payment
                    size={24}
                    fill={getIconColor('/dashboard/payments')}
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                title="Create Product"
                href="/dashboard/create-product"
                isActive={activeSidebar === '/dashboard/create-product'}
                icon={
                  <SquarePlus
                    size={24}
                    className="bg-transparent"
                    stroke={getIconColor('/dashboard/create-product')}
                    fill="none"
                  />
                }
              />
              <SidebarItem
                title="All Products"
                href="/dashboard/all-products"
                isActive={activeSidebar === '/dashboard/all-products'}
                icon={
                  <Boxes
                    size={24}
                    className="bg-transparent"
                    stroke={getIconColor('/dashboard/all-products')}
                    fill="none"
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Events">
              <SidebarItem
                title="Create Events"
                href="/dashboard/create-event"
                isActive={activeSidebar === '/dashboard/create-event'}
                icon={
                  <CalendarPlus
                    size={24}
                    stroke={getIconColor('/dashboard/create-event')}
                    fill="none"
                  />
                }
              />
              <SidebarItem
                title="All Events"
                href="/dashboard/events"
                isActive={activeSidebar === '/dashboard/all-events'}
                icon={
                  <CalendarRange
                    size={24}
                    stroke={getIconColor('/dashboard/all-events')}
                    fill="none"
                  />
                }
              />
            </SidebarMenu>

            <SidebarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                href="/dashboard/inbox"
                isActive={activeSidebar === '/dashboard/inbox'}
                icon={
                  <Mail
                    size={24}
                    stroke={getIconColor('/dashboard/inbox')}
                    fill="none"
                  />
                }
              />

              <SidebarItem
                title="Settings"
                href="/dashboard/settings"
                isActive={activeSidebar === '/dashboard/settings'}
                icon={
                  <Settings
                    size={24}
                    stroke={getIconColor('/dashboard/settings')}
                    fill="none"
                  />
                }
              />

              <SidebarItem
                title="Notifications"
                href="/dashboard/notifications"
                isActive={activeSidebar === '/dashboard/notifications'}
                icon={
                  <BellRing
                    size={24}
                    stroke={getIconColor('/dashboard/notifications')}
                    fill="none"
                  />
                }
              />
            </SidebarMenu>
            <SidebarMenu title="Extras">
              <SidebarItem
                title="Discount Codes"
                href="/dashboard/discounts"
                isActive={activeSidebar === '/dashboard/discounts'}
                icon={
                  <TicketPercent
                    size={24}
                    stroke={getIconColor('/dashboard/discounts')}
                    fill="none"
                  />
                }
              />
            </SidebarMenu>
            <SidebarItem
              title="Logout"
              href="/logout"
              isActive={false}
              icon={<LogOut size={24} fill="none" />}
            />
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SidebarWrapper;

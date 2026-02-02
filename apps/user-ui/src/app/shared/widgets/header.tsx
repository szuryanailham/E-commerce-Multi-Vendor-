'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, HeartIcon, ShoppingCart } from 'lucide-react';
import ProfileIcon from '@/app/assets/svgs/profile-icon';
import HeaderBottom from './header-bottom';
import useUser from '@/hooks/useUser';
import { userStore } from '@/app/store';
const Header = () => {
  const { user, isLoading } = useUser();
  const wishlist = userStore((state: any) => state.wishlist);
  const cart = userStore((state: any) => state.cart);
  // const [suggestions, setSuggestions] = useState<any[]>([]);
  // const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between gap-6">
        <Link href="/">
          <span className="text-3xl font-[500] cursor-pointer">Eshop</span>
        </Link>

        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search for product..."
            className="w-full px-4 pr-[70px] font-Poppins font-medium border-[2.5px] border-[#3489FF] outline-none h-[55px]"
          />
          <div className="w-[60px] cursor-pointer flex items-center justify-center h-[55px] bg-[#3489FF] absolute top-0 right-0">
            <Search color="white" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-8">
          {isLoading ? (
            // Loading State
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : !isLoading && user ? (
            // User Logged In
            <Link href="/profile" className="flex items-center gap-2">
              <ProfileIcon className="w-6 h-6 text-gray-700" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Hello,
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {user.name}
                </span>
              </div>
            </Link>
          ) : (
            // Guest / Not Logged In
            <Link href="/login" className="flex items-center gap-2">
              <ProfileIcon className="w-6 h-6 text-gray-700" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Hello,
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  Sign in
                </span>
              </div>
            </Link>
          )}

          {/* Wishlist + Cart */}
          <div className="flex items-center gap-5">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <HeartIcon className="w-6 h-6 text-gray-700" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                0
              </div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                0
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-b-[#99999938]">
        <HeaderBottom />
      </div>
    </div>
  );
};

export default Header;

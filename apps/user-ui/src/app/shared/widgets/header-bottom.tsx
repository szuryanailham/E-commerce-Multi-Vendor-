'use client';

import { navItems } from '@/configs/constants';
import Link from 'next/link';
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import ProfileIcon from '@/app/assets/svgs/profile-icon';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSticky ? 'fixed top-0 left-0 z-[100] bg-white shadow-lg' : 'relative'
      }`}
    >
      <div
        className={`w-[80%] m-auto flex items-center justify-between  ${
          isSticky ? 'py-3' : 'py-0'
        }`}
      >
        {/* All Dropdown */}
        <div className="relative w-[260px]">
          {/* Button */}
          <div
            onClick={() => setShow(!show)}
            className={`h-[50px] px-5 cursor-pointer flex items-center justify-between bg-[#3489ff] ${
              isSticky ? '-mb-2' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <AlignLeft color="white" />
              <span className="text-white font-medium">All Departments</span>
            </div>

            <ChevronDown
              color="white"
              className={`transition-transform duration-200 ${
                show ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Dropdown */}
          {show && (
            <div className="absolute top-full left-0 w-full h-[400px] bg-[#f5f5f5] shadow-lg z-50">
              {/* dropdown items */}
            </div>
          )}
        </div>

        {/* Navigatiopn Link */}
        <div className="flex items-center">
          {navItems.map((i: NavItemsTypes, index: number) => (
            <Link
              key={index}
              href={i.href}
              className="px-5 font-medium text-sm font-xs"
            >
              {i.title}
            </Link>
          ))}
        </div>
        <div>
          {isSticky && (
            <div className="flex items-center gap-8">
              <Link href="/login" className="flex items-center gap-2">
                <ProfileIcon className="w-6 h-6 text-gray-700" />
                <span className="font-medium">Hello,</span>
                <span className="font-semibold">Sign in</span>
              </Link>

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
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;

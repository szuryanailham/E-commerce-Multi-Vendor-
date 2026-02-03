'use client';
import { userStore } from '@/app/store';
import useDeviceTracking from '@/hooks/useDeviceTracking';
import useLocationTracking from '@/hooks/userLocationTracking';
import useUser from '@/hooks/useUser';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useStore } from 'zustand';

const WishlistPage = () => {
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const addToCart = userStore((state: any) => state.addToCart);
  const removeFromWishlist = userStore(
    (state: any) => state.removeFromWishlist,
  );
  const wishlist = userStore((state: any) => state.wishlist);

  const decreaseQuantity = (id: string) => {
    userStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    userStore.setState((state: any) => ({
      wishlist: state.wishlist.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item,
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromWishlist(id, user, location, deviceInfo);
  };

  return (
    //    Breadcrumb
    <div className="pb-[50px] p-5">
      <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-[16px] font-jost">
        Wishlist
      </h1>

      <Link href="/" className="text-[#55585b] hover:underline">
        Home
      </Link>

      <span className="inline-block w-[4px] h-[4px] mx-2 bg-[#a8acb0] rounded-full"></span>
      <span className="text-[#55585b]">Wishlist</span>

      {/* IF wishlist is empty */}
      {wishlist.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-10">
          Your wishlist is empty! Start adding products.
        </div>
      ) : (
        <div className="flex flex-col gap-10 mt-5">
          {/* Wishlist item table */}
          <table className="w-full border-collapse">
            <thead className="bg-[#f1f3f4]">
              <tr>
                <th className="py-3 text-left pl-4">Product</th>
                <th className="py-3 text-left">Price</th>
                <th className="py-3 text-left">Quantity</th>
                <th className="py-3 text-left">Action</th>
                <th className="py-3 text-left"></th>
              </tr>
            </thead>

            <tbody>
              {wishlist?.map((item: any) => (
                <tr key={item.id} className="border-b border-b-[#0000000e]">
                  <td className="flex items-center gap-3 p-4">
                    <Image
                      width={80}
                      height={80}
                      className="rounded"
                      alt={item.title}
                      src={item.images?.[0]?.url}
                    />
                    <span className="font-medium">{item.title}</span>
                  </td>

                  <td className="px-6 text-lg font-medium">
                    ${item?.sale_price.toFixed(2)}
                  </td>

                  <td>
                    <div className="flex items-center justify-between border border-gray-200 rounded-[20px] w-[90px] p-[2px]">
                      <button
                        className="text-black text-xl px-2 hover:text-gray-600 transition"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        −
                      </button>

                      <span className="px-2 text-sm font-medium">
                        {item?.quantity}
                      </span>

                      <button
                        className="text-black text-xl px-2 hover:text-gray-600 transition"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>
                    <button
                      className="bg-[#2295FF] text-white px-5 py-2 rounded-md hover:bg-[#007bff] transition-all"
                      onClick={() =>
                        addToCart(item, user, location, deviceInfo)
                      }
                    >
                      Add To Cart
                    </button>
                  </td>

                  <td
                    className="text-[#818487] cursor-pointer hover:text-[#ff1826] transition-colors font-medium"
                    onClick={() => removeItem(item.id)}
                    role="button"
                    aria-label="Remove item from wishlist"
                  >
                    × Remove
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

'use client';
import { userStore } from '@/app/store';
import useDeviceTracking from '@/hooks/useDeviceTracking';
import useLocationTracking from '@/hooks/userLocationTracking';
import useUser from '@/hooks/useUser';
import { error } from 'console';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useStore } from 'zustand';

const CartPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const location = useLocationTracking();
  const deviceInfo = useDeviceTracking();
  const [discountPercent, setdiscountPercent] = useState(0);
  const [discountedProductId, setdiscountedProductId] = useState('');
  const [discountAmount, setdiscountAmount] = useState(0);
  const [couponCode, setcouponCode] = useState('');
  const [selectedAddressId, setselectedAddressId] = useState('');
  const cart = userStore((state: any) => state.cart);
  const removeFromCart = userStore((state: any) => state.removeFromCart);
  const [loading, setLoading] = useState(false);

  const decreaseQuantity = (id: string) => {
    userStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    }));
  };

  const increaseQuantity = (id: string) => {
    userStore.setState((state: any) => ({
      cart: state.cart.map((item: any) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item,
      ),
    }));
  };

  const removeItem = (id: string) => {
    removeFromCart(id, user, location, deviceInfo);
  };

  const subtotal = cart.reduce(
    (total: number, item: any) => total + item.quantity * item.sale_price,
    0,
  );

  return (
    <div className="w-full bg-white">
      <div className="md:w-[80%] w-[95%] mx-auto min-h-screen">
        <div className="pb-[50px]">
          <h1 className="md:pt-[50px] font-medium text-[44px] leading-[1] mb-[16px] font-jost">
            Shopping Cart
          </h1>
          <Link href="/" className="text-[#55585b] hover:underline">
            Home
          </Link>
          <span className="inline-block w-[4px] h-[4px] mx-2 bg-[#a8acb0] rounded-full"></span>
          <span className="text-[#55585b]">Cart</span>
        </div>
        {cart.length === 0 ? (
          <div className="text-center text-gray-600 text-lg">
            Your cart is empty! Start adding products
          </div>
        ) : (
          <div className="lg:flex items-start gap-10">
            <table className="w-full lg:w-[70%] border-collapse text-sm">
              <thead>
                <tr className="bg-[#f1f3f4]">
                  <th className="py-4 pl-6 text-left font-medium">Product</th>
                  <th className="py-4 text-center font-medium">Price</th>
                  <th className="py-4 text-center font-medium">Quantity</th>
                  <th className="py-4 text-center font-medium"></th>
                </tr>
              </thead>

              <tbody>
                {cart?.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#0000000e] hover:bg-gray-50 transition"
                  >
                    {/* PRODUCT */}
                    <td className="pl-6 py-5">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item?.images[0]?.url}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="rounded-lg border"
                        />

                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-gray-900">
                            {item.title}
                          </span>

                          {item?.selectedOptions && (
                            <div className="text-xs text-gray-500 flex items-center gap-3">
                              {item?.selectedOptions?.color && (
                                <div className="flex items-center gap-1">
                                  <span>Color</span>
                                  <span
                                    className="w-3 h-3 rounded-full border"
                                    style={{
                                      backgroundColor:
                                        item.selectedOptions.color,
                                    }}
                                  />
                                </div>
                              )}

                              {item?.selectedOptions?.size && (
                                <span>Size: {item.selectedOptions.size}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="text-center px-4">
                      {item?.id === discountedProductId ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="line-through text-gray-400 text-xs">
                            ${item.sale_price.toFixed(2)}
                          </span>
                          <span className="text-green-600 font-semibold">
                            $
                            {(
                              (item.sale_price * (100 - discountPercent)) /
                              100
                            ).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-green-700">
                            Discount applied
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">
                          ${item.sale_price.toFixed(2)}
                        </span>
                      )}
                    </td>

                    {/* QUANTITY */}
                    <td className="text-center">
                      <div className="mx-auto flex items-center justify-between w-[96px] px-3 py-1 border border-gray-300 rounded-full">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="text-lg hover:text-red-500 transition"
                        >
                          −
                        </button>

                        <span className="text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="text-lg hover:text-green-600 transition"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* REMOVE */}
                    <td className="text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-6 shadow-md w-full lg:w-[30%] bg-[#fgfgffg] rounded-lg">
              {discountAmount > 0 && (
                <div className="flex justify-between item-center text-[#010f1c] text-base font-medium pb-1">
                  <span className="font-jost">
                    Discount ({discountPercent})
                  </span>
                  <span className="text-green-600">
                    - ${discountAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#010f1c] text-[20px] font-[550] pb-3">
                <span className="font-jost">Subtotal</span>
                <span>${(subtotal - discountAmount).toFixed(2)}</span>
              </div>
              <hr className="my-4 text-slate-200" />
              <div className="mb-4">
                <h4 className="mb-[7px] font-[500] text-[15px]">
                  Have a Coupon ?
                </h4>
                <div className="flex w-full">
                  <input
                    type="text"
                    value={couponCode}
                    placeholder="Enter coupon code"
                    onChange={(e: any) => setcouponCode(e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-l-md
               focus:outline-none focus:border-blue-500"
                  />

                  <button
                    // onClick={() => couponCodeApply}
                    type="button"
                    className="bg-blue-500 text-white px-4 rounded-r-md
               text-sm font-medium
               hover:bg-blue-600 transition cursor-pointer"
                  >
                    Apply
                  </button>
                  {/* {error && (
                    <p className="text-sm pt-2 text-red-500">{error}</p>
                  )} */}
                </div>
                <hr className="my-4 text-slate-200" />
                <div className="mb-4">
                  <h4 className="mb-2 font-medium text-[15px] text-gray-800">
                    Select Shipping Address
                  </h4>

                  <select
                    value={selectedAddressId}
                    onChange={(e) => setselectedAddressId(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-md
               bg-white
               focus:outline-none focus:border-blue-500
               transition"
                  >
                    <option value="123">Home – Yogyakarta, Indonesia</option>
                  </select>
                </div>

                <hr className="my-4 text-slate-200" />
                <div className="mb-4">
                  <h4 className="mb-2 font-medium text-[15px] text-gray-800">
                    Select Payment Method
                  </h4>

                  <select
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-md
               bg-white
               focus:outline-none focus:border-blue-500
               transition"
                  >
                    <option value="bank_transfer">Online Payments</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
                <hr className="my-4 text-slate-200" />
                <div className="flex justify-between items-center text-[#010f1c] text-[20px] font-[550] pb-3">
                  <span className="font-jost">Total</span>
                  <span>${(subtotal - discountAmount).toFixed(2)}</span>
                </div>

                <button
                  disabled={loading}
                  className="w-full flex item-center justify-center gap-2 cursor-pointer mt-4 py-3 bg-[#010f1c] text-white hover:bg-[#0989FF] transition-all rounded-lg"
                >
                  {loading && <Loader2 className="animate-spin w-h h-5" />}
                  {loading ? 'Redirecting....' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import Link from 'next/link';
import GoogleLoginButton from '@/app/shared/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
type FormData = {
  email: string;
  password: string;
};

const Signup = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter(); // ✅ sekarang aman

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log(data);
    // contoh redirect
    // router.push('/');
  };

  return (
    <div className="w-full min-h-[85vh] bg-[rgb(241,241,241)] py-10">
      {/* Title */}
      <h1 className="text-4xl font-semibold text-black text-center">Signup</h1>

      <p className="text-center text-lg font-medium text-[#00000999]">
        Home · Signup
      </p>
      {/* Card Wrapper */}
      <div className="w-full flex item-center justify-center mt-10">
        <div className="w-full max-w-[480px] p-8 bg-white shadow-lg rounded-lg">
          {/* Card Title */}
          <h3 className="text-3xl font-semibold text-center mb-2">
            Signup to Eshop
          </h3>

          <p className="text-center text-gray-500 mb-6">
            already have an account?{' '}
            <Link href="/login" className="text-blue-500 font-medium">
              Login
            </Link>
          </p>

          {/* Google Button */}
          <GoogleLoginButton onClick={() => console.log('Login with Google')} />
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">Or Sign in with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Form with email */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="user@gmail.com"
              className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">
                {String(errors.email.message)}
              </p>
            )}

            {/* passowrd */}

            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                placeholder="Min. 6 characters"
                type={isPasswordVisible ? 'text' : 'password'}
                className="w-full p-2 pr-10 border border-gray-300 outline-0 !rounded mb-1"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              {/* toggle visibility */}
              <button
                type="button"
                onClick={() => setPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {isPasswordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
            <div className="flex justify-between my-5">
              <label className="flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <Link href={'/forget-password'} className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
            >
              Signup
            </button>
            {serverError && (
              <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

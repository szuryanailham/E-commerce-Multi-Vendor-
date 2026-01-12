'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/login-seller`,
        data,
        { withCredentials: true },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setServerError(null);
      router.push('/');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage =
        error.response?.data?.message ?? 'Invalid credentials';
      setServerError(errorMessage);
    },
  });

  const onSubmit = async (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-[85vh] bg-[rgb(241,241,241)] py-10">
      {/* Title */}
      <h1 className="text-4xl font-semibold text-black text-center">Login</h1>

      <p className="text-center text-lg font-medium text-[#00000999]">
        Home · Login
      </p>
      {/* Card Wrapper */}
      <div className="w-full flex item-center justify-center mt-10">
        <div className="w-full max-w-[480px] p-8 bg-white shadow-lg rounded-lg">
          {/* Card Title */}
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to Eshop
          </h3>

          <p className="text-center text-gray-500 mb-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-500 font-medium">
              Sign Up
            </Link>
          </p>

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
              <Link href={'/forgot-password'} className="text-blue-500 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
            >
              {loginMutation?.isPending ? 'Login in ...' : 'Login'}
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

export default Login;

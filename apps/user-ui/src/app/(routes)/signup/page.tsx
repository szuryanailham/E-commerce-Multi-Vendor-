'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import GoogleLoginButton from '@/app/shared/components/google-button';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
type FormData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev < 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log('API URL:', process.env.NEXT_PUBLIC_SERVER_URL);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-registration`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error: any) => {
      console.error('Signup failed:', {
        status: error.response?.status,
        message: error.response?.data,
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-user`,
        { ...userData, otp: otp.join('') },
      );
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  const onSubmit = async (data: FormData) => {
    signUpMutation.mutate(data);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace') {
      // Jika ada isi → hapus saja
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        return;
      }

      // Jika kosong → pindah ke kiri
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const resendOtp = () => {
    if (userData) {
      signUpMutation.mutate(userData);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[rgb(241,241,241)] py-10">
      {/* Page Title */}
      <h1 className="text-4xl font-semibold text-black text-center">Signup</h1>
      <p className="text-center text-lg font-medium text-[#00000099]">
        Home · Signup
      </p>

      {/* Center Wrapper */}
      <div className="w-full flex items-center justify-center mt-10">
        <div className="w-full max-w-[480px] p-8 bg-white shadow-lg rounded-lg">
          {/* Card Header */}
          <h3 className="text-3xl font-semibold text-center mb-2">
            Signup to Eshop
          </h3>
          <p className="text-center text-gray-500 mb-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 font-medium">
              Login
            </Link>
          </p>

          {/* Google Login */}
          <GoogleLoginButton onClick={() => console.log('Login with Google')} />

          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">Or sign up with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* ================= FORM / OTP SWITCH ================= */}
          {!showOtp ? (
            /* ================= EMAIL FORM ================= */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="username..."
                  className="w-full p-2 border border-gray-300 !rounded outline-0"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {String(errors.name.message)}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="user@gmail.com"
                  className="w-full p-2 border border-gray-300 !rounded outline-0"
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
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    className="w-full p-2 border border-gray-300 !rounded outline-0"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!isPasswordVisible)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {isPasswordVisible ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={signUpMutation.isPending}
                className="w-full mt-2 text-lg bg-black text-white py-2 rounded-lg"
              >
                {signUpMutation.isPending ? 'signing up ...' : 'Signup'}
              </button>
            </form>
          ) : (
            /* ================= OTP FORM ================= */
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Enter OTP Code</h3>
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    className="w-12 h-12 text-center border border-gray-400 outline-none !rounded "
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              {/* Submit button */}
              <button
                className="w-full spinner mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </button>
              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button
                    className="text-blue-500 cursor-pointer "
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s `
                )}
              </p>
              {verifyOtpMutation.isError &&
                verifyOtpMutation.error instanceof AxiosError && (
                  <p className="text-red-500 text-sm mt-5">
                    {verifyOtpMutation.error?.response?.data?.message ||
                      verifyOtpMutation.error?.message}
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

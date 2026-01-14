'use client';

import { useForm } from 'react-hook-form';
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { countries } from '@/utils/country';
import CreateShop from '@/shared/modules/auth/create-shop';
import StripeLogo from '@/assets/svgs/stripe-logo';
import { bankNames } from '@/utils/bank';

const Signup = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [sellerData, setSellerData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [sellerId, setSellerId] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const accountNumberMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-acount-number`,
        data,
      );
      return response.data;
    },
    onSuccess: (res) => {
      setServerError(null);
      window.location.href = res.refresh_url;
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/seller-registration`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, formData) => {
      setSellerData(formData);
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
      if (!sellerData) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-seller`,
        { ...sellerData, otp: otp.join('') },
      );
      return response.data;
    },
    onSuccess: (data) => {
      setSellerId(data?.seller?.id);
      setActiveStep(2);
    },
  });

  const onSubmit = async (data: any) => {
    signUpMutation.mutate(data);
  };

  const onSubmitNumberAccount = async (data: any) => {
    const AccountNumberData = { ...data, sellerId };
    accountNumberMutation.mutate(AccountNumberData);
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
    if (sellerData) {
      signUpMutation.mutate(sellerData);
    }
  };

  const connectStripe = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-stripe-link`,
        { sellerId },
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Stripe Connection Error :', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
      {/* Stepper */}
      <div className="relative flex items-center justify-between md:w-[50%] mb-8">
        <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10" />
        {[1, 2, 3].map((step) => (
          <div key={step}>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                step <= activeStep ? 'bg-blue-600' : 'bg-blue-300'
              }`}
            >
              {step}
            </div>
            <span className="ml-[-20px] text-sm">
              {step === 1
                ? 'Create Account'
                : step === 2
                  ? 'Setup Shop'
                  : 'Connect Bank'}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              /* ================= SIGN UP FORM ================= */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="text-2xl font-semibold text-center mb-4">
                  Create Account
                </h3>

                {/* Name */}
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="username..."
                    className="w-full p-2 border border-gray-300 !rounded outline-none"
                    {...register('name', { required: 'Name is required' })}
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
                    className="w-full p-2 border border-gray-300 !rounded outline-none"
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

                {/* Phone number */}
                <label className="block text-gray-700 mb-1">Phone Number</label>

                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
                  {...register('phone_number', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[1-9][0-9]{7,14}$/,
                      message: 'Please enter a valid phone number',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Phone number must be at least 15 digits',
                    },
                  })}
                  placeholder="08xxxxxxxxxx"
                />

                {errors.phone_number && (
                  <p className="text-red-500 text-sm">
                    {String(errors.phone_number.message)}
                  </p>
                )}

                {/* Country */}

                <div>
                  <label className="block text-gray-700 mb-1">Country</label>

                  <select
                    className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1 bg-white"
                    {...register('country', {
                      required: 'Country is required',
                    })}
                  >
                    <option value="" disabled>
                      Select your country
                    </option>

                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  {errors.country && (
                    <p className="text-red-500 text-sm">
                      {String(errors.country.message)}
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
                      className="w-full p-2 border border-gray-300 !rounded outline-none"
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
                  className="w-full text-lg bg-black text-white py-2 rounded-lg"
                >
                  {signUpMutation.isPending ? 'Signing up...' : 'Signup'}
                </button>
                {signUpMutation.isError &&
                  signUpMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm mt-2">
                      {signUpMutation.error.response?.data?.message}
                    </p>
                  )}
                <p className="text-center text-gray-500 mb-6">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-500 font-medium">
                    Login
                  </Link>
                </p>
              </form>
            ) : (
              /* ================= OTP FORM ================= */
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Enter OTP Code</h3>

                <div className="flex justify-center gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={(el) => {
                        if (el) {
                          inputRefs.current[index] = el;
                        }
                      }}
                      className="w-12 h-12 text-center border border-gray-400 !rounded outline-none"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>

                <button
                  className="w-full text-lg bg-blue-500 text-white py-2 rounded-lg"
                  disabled={verifyOtpMutation.isPending}
                  onClick={() => verifyOtpMutation.mutate()}
                >
                  {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
                </button>

                <p className="text-sm">
                  {canResend ? (
                    <button className="text-blue-500" onClick={resendOtp}>
                      Resend OTP
                    </button>
                  ) : (
                    `Resend OTP in ${timer}s`
                  )}
                </p>

                {verifyOtpMutation.isError &&
                  verifyOtpMutation.error instanceof AxiosError && (
                    <p className="text-red-500 text-sm">
                      {verifyOtpMutation.error.response?.data?.message ||
                        verifyOtpMutation.error.message}
                    </p>
                  )}
              </div>
            )}
          </>
        )}
        {activeStep === 2 && (
          <CreateShop sellerId={sellerId} setActiveStep={setActiveStep} />
        )}
        {activeStep === 3 && (
          <div>
            <h3 className="text-2xl font-semibold text-center">
              Withdraw Method
            </h3>
            <br />
            <button
              onClick={connectStripe}
              className="w-full m-auto flex items-center text-white justify-center text-md
               bg-[#334155] text-while py-2 rounded-lg"
            >
              Connect Stripe <StripeLogo width={100} height={32} />
            </button>
            <div className="flex items-center my-5 text-gray-400 text-sm">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3">Or with Account Number</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>
            <form onSubmit={handleSubmit(onSubmitNumberAccount)}>
              <div>
                <label className="block text-gray-700 mb-1">Bank *</label>
                <select
                  className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1 bg-white"
                  {...register('bank', {
                    required: 'Bank is required',
                  })}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your bank
                  </option>

                  {bankNames.map((bank) => (
                    <option key={bank.name} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>

                {errors.bank && (
                  <p className="text-red-500 text-sm">
                    {String(errors.bank.message)}
                  </p>
                )}
              </div>

              {/* Input Account Number */}

              <div>
                <label className="block text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 1234567890"
                  className="w-full p-2 border border-gray-300 !rounded outline-none"
                  {...register('account_number', {
                    required: 'Account number is required',
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Account number must contain only numbers',
                    },
                    minLength: {
                      value: 8,
                      message: 'Account number must be at least 8 digits',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Account number must be at most 20 digits',
                    },
                  })}
                />

                {errors.account_number && (
                  <p className="text-red-500 text-sm">
                    {String(errors.account_number.message)}
                  </p>
                )}
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={accountNumberMutation.isPending}
                className="w-full text-lg bg-black text-white py-2 rounded-lg"
              >
                {accountNumberMutation.isPending ? 'connecting...' : 'Connect'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;

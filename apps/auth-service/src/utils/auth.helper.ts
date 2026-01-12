import crypto from 'crypto';
import { ValidationError } from '@e-commerce-multi-vendor/error-handler';
import redis from './redis/redis';
import { sendEmail } from './send-email';
import { NextFunction, Request, Response } from 'express';
import prisma from '@e-commerce-multi-vendor/prisma';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Validate registration payload
 */
export const validationRegistrationData = (
  data: any,
  userType: 'user' | 'seller',
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === 'seller' && (!phone_number || !country))
  ) {
    throw new ValidationError('Missing required fields');
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

/**
 * Check OTP restriction & cooldown
 */
export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      'Account locked due to multiple failed attempts. Try again after 30 minutes',
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError(
      'Too many OTP requests. Please wait 1 hour before requesting again',
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError(
      'Please wait 1 minute before requesting a new OTP',
    );
  }
};

/**
 * Track OTP request count
 */
export const trackOtpRequests = async (email: string) => {
  const otpRequestKey = `otp_request:${email}`;
  const otpRequests = Number((await redis.get(otpRequestKey)) || 0);

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, 'locked', {
      ex: 3600,
    });

    throw new ValidationError(
      'Too many OTP requests. Please wait 1 hour before requesting again',
    );
  }

  await redis.set<number>(otpRequestKey, otpRequests + 1, {
    ex: 3600,
  });
};

/**
 * Send OTP email
 */
export const sendOtp = async (
  email: string,
  name: string,
  template: string,
) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, 'Verify your Email', template, {
    name,
    otp,
  });

  await redis.set<string>(`otp:${email}`, otp, {
    ex: 300, // 5 minutes
  });

  await redis.set<string>(`otp_cooldown:${email}`, 'true', {
    ex: 60, // 1 minute
  });
};

/**
 * Verify OTP
 */

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction,
) => {
  // 1. Cek lock dulu
  const isLocked = await redis.get(`otp_lock:${email}`);
  if (isLocked) {
    throw new ValidationError(
      'Your account is locked. Please try again later.',
    );
  }

  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    throw new ValidationError('Invalid or expired OTP!');
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');
  const StrOtp = storedOtp.toString().trim();

  // 2. OTP salah
  if (StrOtp !== otp) {
    const attempts = failedAttempts + 1;

    // Lock di percobaan ke-3
    if (attempts >= 3) {
      await redis.set(`otp_lock:${email}`, 'locked', {
        ex: 1800, // 30 menit
      });

      await redis.del(`otp:${email}`, failedAttemptsKey);

      throw new ValidationError(
        'Too many failed attempts. Your account is locked for 30 minutes!',
      );
    }

    await redis.set(failedAttemptsKey, attempts, {
      ex: 300, // 5 menit
    });

    throw new ValidationError(`Incorrect OTP, ${3 - attempts} attempts left`);
  }

  // 3. OTP benar → cleanup
  await redis.del(`otp:${email}`, failedAttemptsKey, `otp_lock:${email}`);
};

// user forgot password
export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: 'user' | 'seller',
) => {
  try {
    const { email } = req.body;
    if (!email) throw new ValidationError('email is required');

    // Find user/seller in DB

    const user =
      userType === 'user'
        ? await prisma.users.findUnique({
            where: { email },
          })
        : await prisma.sellers.findUnique({
            where: { email },
          });

    if (!user) throw new ValidationError(`${userType} not found`);

    // cek otp restrictions
    await checkOtpRestrictions(email);
    await trackOtpRequests(email);

    // Generate OTP send email
    await sendOtp(
      email,
      user.name,
      userType === 'user'
        ? 'forgot-password-user-mail'
        : 'forgot-password-seller-mail',
    );

    res.status(200).json({
      message: 'OTP sent to email , Please verify your account!',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      throw new ValidationError('Email and OTP are required!');
    await verifyOtp(email, otp, next);
    res.status(200).json({
      message: 'OTP verified, You can now reset your password. ',
    });
  } catch (error) {
    next(error);
  }
};

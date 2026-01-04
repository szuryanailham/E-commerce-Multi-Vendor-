import crypto from 'crypto';
import { ValidationError } from '@e-commerce-multi-vendor/error-handler';
import redis from './redis/redis';
import { sendEmail } from './send-email';

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

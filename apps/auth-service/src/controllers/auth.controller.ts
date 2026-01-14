import { Response, Request, NextFunction } from 'express';
import {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validationRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
} from '../utils/auth.helper';
import bcrypt from 'bcryptjs';
import prisma from '@e-commerce-multi-vendor/prisma';
import {
  AuthError,
  ValidationError,
} from '@e-commerce-multi-vendor/error-handler';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { setCookies } from '../utils/cookies/setCookies';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

// Register a new user
export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validationRegistrationData(req.body, 'user');
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ValidationError('User already exists with this email');
    }

    await checkOtpRestrictions(email);
    await trackOtpRequests(email);
    await sendOtp(email, name, 'user-activation-mail');

    res.status(200).json({
      message: 'OTP sent to email, Please verify your account',
    });
  } catch (error) {
    return next(error);
  }
};

// verify user with otp
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError('all fields are required!'));
    }
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError('User already exists with this email'));
    }

    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
    });
  } catch (error) {
    return next(error);
  }
};

// login user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError('Email and password are required!'));
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) return next(new AuthError("User doesn't exists!"));

    // verify password
    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return next(new AuthError('Invalid email or password'));
    }

    // Generate access and refresh token
    const accessToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: 'user' },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: '7d',
      },
    );

    // store the refresh and access in httponly secure cookie
    setCookies(res, 'refresh_token', refreshToken);
    setCookies(res, 'access_token', accessToken);

    res.status(200).json({
      message: 'Login successfull!',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return next(error);
  }
};

// refresh token
export const refreshToken = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken =
      req.cookies['refresh-token'] ||
      req.cookies['seller-refresh-token'] ||
      req.headers.authorization?.split(' ')[1];

    if (!refreshToken) {
      throw new ValidationError('Unauthorized! No refresh token');
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { id: string; role: string };

    if (!decoded || !decoded.id || !decoded.role) {
      return new JsonWebTokenError('Forbidden ! Invalid refresh token');
    }

    let account;
    if (decoded.role == 'user') {
      account = await prisma.users.findUnique({
        where: {
          id: decoded.id,
        },
      });
    } else if (decoded.role == 'seller') {
      account = await prisma.sellers.findUnique({
        where: {
          id: decoded.id,
        },
        include: {
          shop: true,
        },
      });
    }

    if (!account) {
      return new AuthError('Forbidden! User/Seller not found');
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    if (decoded.role === 'user') {
      setCookies(res, 'access_token', newAccessToken);
    } else if (decoded.role === 'seller') {
      setCookies(res, 'seller-access-token', newAccessToken);
    }

    req.role = decoded.role;
    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

// get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// user forgot password
export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await handleForgotPassword(req, res, next, 'user');
};

// Verify forget Password OTP
export const verifyUserForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  await verifyForgotPasswordOtp(req, res, next);
};

// Reset User Password
export const resetUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return next(new ValidationError('Email and new password are required!'));

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) return next(new ValidationError('User not found!'));

    const isSamePassword = await bcrypt.compare(newPassword, user.password!);

    if (isSamePassword) {
      return next(
        new ValidationError(
          'New Password cannot be the same as the old password',
        ),
      );
    }
    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
    res.status(200).json({
      message: 'Password reset successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// register a new seller
export const sellerRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    validationRegistrationData(req.body, 'seller');

    const { name, email } = req.body;

    const existingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (existingSeller) {
      throw new ValidationError('Seller already exists with this email!');
    }

    await checkOtpRestrictions(email);
    await trackOtpRequests(email);
    await trackOtpRequests(email);
    await sendOtp(email, name, 'seller-activation-mail');

    res.status(200).json({
      message: 'OTP sent to email. Please verify  your account',
    });
  } catch (error) {
    next(error);
  }
};

// verify seller with OTP
export const verifySeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp, password, name, phone_number, country } = req.body;

    if (!email || !otp || !password || !name || !phone_number || !country) {
      return next(new ValidationError('All fields are required'));
    }
    const exsistingSeller = await prisma.sellers.findUnique({
      where: { email },
    });

    if (exsistingSeller) {
      return next(
        new ValidationError('Seller already axists with this email!'),
      );
    }
    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
        phone_number,
      },
    });

    res.status(201).json({
      seller,
      message: 'Seller registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const createShop = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, bio, address, opening_hours, website, category, sellerId } =
      req.body;

    if (!name || !bio || !address || !opening_hours || !category || !sellerId) {
      return next(new ValidationError('All fields are required'));
    }

    const shopData: any = {
      name,
      bio,
      address,
      openingHours: opening_hours,
      category,
      sellerId,
    };

    if (website && website.trim() === '') {
      shopData.website = website;
    }

    const shop = await prisma.shops.create({
      data: shopData,
    });

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    next(error);
  }
};

// create stripe connect account link
export const createStripConnectLink = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sellerId } = req.body;
    if (!sellerId) return next(new ValidationError('Seller ID is required!'));

    const seller = await prisma.sellers.findUnique({
      where: {
        id: sellerId,
      },
    });

    if (!seller) {
      return next(
        new ValidationError('Seller is not available with this id ! '),
      );
    }

    const account = await stripe.accounts.create({
      type: 'express',
      email: seller?.email,
      country: 'ID',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    await prisma.sellers.update({
      where: {
        id: sellerId,
      },
      data: {
        stripeId: account.id,
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `http://localhost:3000/pending`,
      return_url: `http://localhost:3000/success`,
      type: 'account_onboarding',
    });

    res.json({ url: accountLink.url });
  } catch (error) {
    console.log('ERROR STRIPE ', error);
    return next(error);
  }
};

// Input Account Number  Seller
export const updateAccountNumber = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sellerId, bank, account_number } = req.body;

    if (!sellerId || !bank || !account_number) {
      return next(new ValidationError('All fields are required'));
    }

    const acountNumber = await prisma.sellers.update({
      where: {
        id: sellerId,
      },
      data: {
        account_number: account_number,
        bank: bank,
      },
    });
    res.status(201).json({
      success: true,
      data: {
        id: acountNumber.id,
        bank: acountNumber.bank,
        account_number: acountNumber.account_number,
      },
      refresh_url: `http://localhost:3000/pending`,
      return_url: `http://localhost:3000/success`,
    });
  } catch (error) {
    console.error('Error connecting bank account:', error);
    return next(error);
  }
};

// login Seller
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError('Email and passowrd are required'));
    }

    const seller = await prisma.sellers.findUnique({
      where: { email },
    });
    if (!seller)
      return next(new ValidationError('Invalid email or Passwords!'));

    const isMatch = await bcrypt.compare(password, seller.password);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    if (!isMatch) {
      return next(new ValidationError('Invalid email or Password'));
    }

    //Generate access and refresh tokens
    const accessToken = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { id: seller.id, role: 'seller' },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '7d' },
    );

    // store refresh token and access token
    setCookies(res, 'seller-refresh-token', refreshToken);
    setCookies(res, 'seller-access-token', accessToken);

    res.status(200).json({
      message: 'Login Successfull!',
      seller: { id: seller.id, email: seller.email, name: seller.email },
    });
  } catch (error) {
    next(error);
  }
};

// login seller
export const getSeller = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seller = req.seller;
    res.status(201).json({
      success: true,
      seller,
    });
  } catch (error) {
    next(error);
  }
};

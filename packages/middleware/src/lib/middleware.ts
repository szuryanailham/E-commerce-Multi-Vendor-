import { prismaClient } from '@e-commerce-multi-vendor/prisma';
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

export const isAuthenticated = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies['access_token'] ||
      req.cookies['seller-access-token'] ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ TOKEN NOT FOUND');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Token missing.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: 'user' | 'seller';
    };

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Invalid token.',
      });
    }

    let account;

    // Fetch account berdasarkan role
    if (decoded.role === 'user') {
      account = await prismaClient.users.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          // Jangan include password di response
        },
      });

      if (!account) {
        console.log('❌ USER NOT FOUND');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized! User not found.',
        });
      }

      req.user = account;
      req.role = 'user';
    } else if (decoded.role === 'seller') {
      account = await prismaClient.sellers.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
          phone_number: true,
          stripeId: true,
          account_number: true,
          bank: true,
          createdAt: true,
          updatedAt: true,
          shop: true,
          // Jangan include password di response
        },
      });

      if (!account) {
        console.log('❌ SELLER NOT FOUND');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized! Seller not found.',
        });
      }

      req.seller = account;
      req.role = 'seller';
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Invalid role.',
      });
    }

    // Lanjutkan ke next middleware/controller
    return next();
  } catch (error: any) {
    console.error('❌ AUTH ERROR:', error);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Token expired.',
        error: 'TOKEN_EXPIRED',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized! Invalid token.',
        error: 'INVALID_TOKEN',
      });
    }

    // Generic error
    return res.status(401).json({
      success: false,
      message: 'Unauthorized! Authentication failed.',
      error: error.message,
    });
  }
};

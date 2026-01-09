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
      req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('❌ TOKEN NOT FOUND');
      return res.status(401).json({
        message: 'Unauthorized! Token missing.',
      });
    }
    // verify access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: 'user' | 'seller';
    };

    // find user by id
    const account = await prismaClient.users.findUnique({
      where: { id: decoded.id },
    });

    if (!account) {
      console.log('❌ USER NOT FOUND');
      return res.status(401).json({
        message: 'Unauthorized! User not found.',
      });
    }
    req.user = account;
    return next();
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return res.status(401).json({
      message: 'Unauthorized! Invalid or expired token.',
      detail: { error },
    });
  }
};

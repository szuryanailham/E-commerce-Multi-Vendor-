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
      req.cookies['access-token'] ||
      req.cookies['seller-access-token'] ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.log('❌ TOKEN NOT FOUND');
      return res.status(401).json({
        message: 'Unauthorized! Token missing.',
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: 'user' | 'seller';
    };

    let account;

    if (decoded.role == 'user') {
      account = await prismaClient.users.findUnique({
        where: { id: decoded.id },
      });
      req.user = account;
    } else if (decoded.role == 'seller') {
      account = await prismaClient.sellers.findUnique({
        where: { id: decoded.id },
        include: { shop: true },
      });
      req.seller = account;
    }

    if (!account) {
      console.log('❌ USER NOT FOUND');
      return res.status(401).json({
        message: 'Unauthorized! User not found.',
      });
    }
    req.user = decoded.role;
    return next();
  } catch (error) {
    console.error('AUTH ERROR:', error);
    return res.status(401).json({
      message: 'Unauthorized! Invalid or expired token.',
      detail: { error },
    });
  }
};

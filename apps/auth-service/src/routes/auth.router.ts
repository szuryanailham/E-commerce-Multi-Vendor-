import express, { Router } from 'express';

import {
  createShop,
  createStripConnectLink,
  getSeller,
  getUser,
  loginSeller,
  loginUser,
  refreshToken,
  resetUserPassword,
  sellerRegistration,
  updateAccountNumber, 
  userForgotPassword,
  userRegistration,
  verifySeller,
  verifyUser,
  verifyUserForgotPassword,
} from '../controllers/auth.controller.js';
import isSeller from '@e-commerce-multi-vendor/middleware';
import isAuthenicated from '@e-commerce-multi-vendor/middleware';

const router: Router = express.Router();

/**
 * ==========================
 * AUTH ROUTES
 * ==========================
 */

/**
 * @openapi
 * /api/user-registration:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ilham Suryana
 *               email:
 *                 type: string
 *                 example: szuryanailham090102@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/user-registration', userRegistration);

/**
 * @openapi
 * /api/verify-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify user email with OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: szuryanailham090102@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-user', verifyUser);

/**
 * @openapi
 * /api/login-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: szuryanailham090102@gmail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login-user', loginUser);

/**
 * @openapi
 * /api/forgot-password-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Request forgot password OTP (User)
 *     description: Send OTP to user's email for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: szuryanailham090102@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.get('/logged-in-user', isAuthenicated, getUser);
router.post('/forgot-password-user', userForgotPassword);

/**
 * @openapi
 * /api/verify-forgot-password-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify forgot password OTP (User)
 *     description: Verify OTP sent to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: szuryanailham090102@gmail.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-forgot-password-user', verifyUserForgotPassword);

/**
 * @openapi
 * /api/reset-password-user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password
 *     description: Reset password after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: szuryanailham090102@gmail.com
 *               newPassword:
 *                 type: string
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 */
router.post('/reset-password-user', resetUserPassword);
router.post('/refresh-token', refreshToken);
router.get('/logged-in-user', isAuthenicated, getUser);
router.post('/seller-registration', sellerRegistration);
router.post('/verify-seller', verifySeller);
router.post('/create-shop', createShop);
router.post('/create-stripe-link', createStripConnectLink);
router.post('/create-acount-number', updateAccountNumber);
router.post('/login-seller', loginSeller);
router.get('/logged-in-seller', isAuthenicated, isSeller, getSeller);
export default router;

import express, { Router } from 'express';

import {
  loginUser,
  userRegistration,
  verifyUser,
} from '../controllers/auth.controller.js';

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

export default router;

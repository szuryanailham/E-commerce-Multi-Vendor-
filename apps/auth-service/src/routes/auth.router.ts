import express, { Router } from 'express';
import { userRegistration } from '../controllers/auth.controller.js';

const router: Router = express.Router();

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
 *                 example: ilhamsuryana@mail.com
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

export default router;

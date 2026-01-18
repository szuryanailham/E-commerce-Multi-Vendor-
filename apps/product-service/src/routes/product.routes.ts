import { Router } from 'express';
import { getCategories } from '../controllers/product.controller';

const router = Router();

/**
 * @swagger
 * /api/products/get-categories:
 *   get:
 *     summary: Get product categories and subcategories
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Categories not found
 *       500:
 *         description: Internal server error
 */
router.get('/get-categories', getCategories);

export default router;

import { Router } from 'express';
import {
  createDiscountCodes,
  createProduct,
  deleteDiscountCode,
  deleteProductImage,
  getCategories,
  getDiscountCodes,
  uploadProductImage,
  // uploadProductImage,
} from '../controllers/product.controller';
import isAuthenicated from '@e-commerce-multi-vendor/middleware';
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
router.post('/create-discount-code', isAuthenicated, createDiscountCodes);
router.get('/get-discount-codes', isAuthenicated, getDiscountCodes);
router.delete('/delete-discount-code/:id', isAuthenicated, deleteDiscountCode);
router.post('/uploud-product-image', isAuthenicated, uploadProductImage);
router.delete('/delete-product-image', isAuthenicated, deleteProductImage);
router.post('/create-product', isAuthenicated, createProduct);
export default router;

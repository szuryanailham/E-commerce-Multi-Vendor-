import { Request, Response, NextFunction } from 'express';
import prisma from '@e-commerce-multi-vendor/prisma';
import {
  AuthError,
  NotFoundError,
  ValidationError,
} from '@e-commerce-multi-vendor/error-handler';
import { imageKit } from '@e-commerce-multi-vendor/imagekit';

// get Product Categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = await prisma.site_config.findFirst();

    if (!config) {
      return res.status(404).json({
        message: 'Categories not found',
      });
    }

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

// Create discount codes
export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: {
        discountCode,
      },
    });

    if (isDiscountCodeExist) {
      return next(
        new ValidationError(
          'Discount code already available. Please use a different code.',
        ),
      );
    }

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });

    return res.status(201).json({
      success: true,
      discount_code,
      message: 'Discount code successfully created',
    });
  } catch (error) {
    return next(error);
  }
};

// get discount codes
export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: {
        sellerId: req.seller.id,
      },
    });
    return res.status(200).json({
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

// delete discount codes
export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCodes = await prisma.discount_codes.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        sellerId: true,
      },
    });

    if (!discountCodes) {
      return next(new NotFoundError('Discount code not found'));
    }

    if (discountCodes.sellerId !== sellerId) {
      return next(
        new ValidationError(
          'You are not authorized to delete this discount code',
        ),
      );
    }

    await prisma.discount_codes.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Discount code deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

//  uploud product images
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileName } = req.body;

    const response = await imageKit.upload({
      file: fileName,
      fileName: `product-${Date.now()}.jpg`,
      folder: '/products',
    });

    res.status(201).json({
      file_url: response.url,
      fileId: response.fileId,
    });
  } catch (error) {
    next(error);
  }
};

// delete product images

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
  } catch (error) {
    const { fileId } = req.body;

    const response = await imageKit.deleteFile(fileId);
    res.status(201).json({
      success: true,
      response,
    });
  }
};

// create product
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      short_description,
      detail_description,
      warranty,
      custom_specification,
      slug,
      tags,
      cash_on_delivery,
      brand,
      embed_url,
      category,
      colors = [],
      sizes = [],
      discountCodes = [],
      stock,
      sale_price,
      regular_price,
      subcategory,
      custom_properties = {},
      images = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !detail_description ||
      !category ||
      !subcategory ||
      !sale_price ||
      !regular_price ||
      !stock ||
      !tags ||
      !images
    ) {
      return next(new ValidationError('Missing required fields'));
    }

    if (!req.seller?.id || !req.seller?.shop?.id) {
      return next(new AuthError('Only seller can create products!'));
    }

    // ✅ SLUG CHECK
    const slugChecking = await prisma.products.findUnique({
      where: { slug },
    });

    if (slugChecking) {
      return next(
        new ValidationError('Slug already exists! Please use another slug.'),
      );
    }

    const newProduct = await prisma.products.create({
      data: {
        title,
        short_description,
        detail_description,
        warranty,
        cashOnDelivery: cash_on_delivery,
        slug,
        tags: Array.isArray(tags) ? tags : tags.split(','),
        brand,
        video_url: embed_url,
        category,
        subCategory: subcategory,
        colors: colors || [],
        sizes: sizes || [],
        stock: Number(stock),
        sale_price: Number(sale_price),
        regular_price: Number(regular_price),
        discount_codes: discountCodes,
        custom_specification: custom_specification || {},
        custom_properties: custom_properties || {},
        shop: {
          connect: {
            id: req.seller!.shop!.id,
          },
        },

        images: {
          create: images
            .filter((img: any) => img && img.fileId && img.file_url)
            .map((img: any) => ({
              file_id: img.fileId,
              url: img.file_url,
            })),
        },
      },
    });

    return res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getShopProdcuts = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// delete product
export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError('Product not found'));
    }

    if (product.shopId !== sellerId) {
      return next(new ValidationError('Unauthorized action'));
    }

    if (product.isDeleted) {
      return next(new ValidationError('Product is already deleted'));
    }

    const deletedProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
      },
    });

    return res.status(200).json({
      message:
        'Product is scheduled for deletion in 24 hours. You can restore it within this time.',
      deleteAt: deletedProduct.deletedAt,
    });
  } catch (error) {
    next(error);
  }
};

// restore product
export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, shopId: true, isDeleted: true },
    });

    if (!product) {
      return next(new ValidationError('Product not found'));
    }

    if (product.shopId !== sellerId) {
      return next(new ValidationError('Unauthorized action'));
    }

    if (!product.isDeleted) {
      return next(new ValidationError('Product is not in deleted state'));
    }

    await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return res.status(200).json({
      message: 'Product successfully restored',
    });
  } catch (error) {
    next(error);
  }
};

// get All product

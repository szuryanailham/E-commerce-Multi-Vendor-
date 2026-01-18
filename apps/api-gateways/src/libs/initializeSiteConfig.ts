import { prismaClient } from '@e-commerce-multi-vendor/prisma';

const initializeConfig = async () => {
  try {
    const existingConfig = await prismaClient.site_config.findFirst();
    if (!existingConfig) {
      await prismaClient.site_config.create({
        data: {
          categories: [
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Sports & Fitness',
          ],
          subCategories: {
            Electronics: ['Mobiles', 'Laptops', 'Accessories', 'Gaming'],
            Fashion: ['Men', 'Women', 'Kids', 'Footwear'],
            'Home & Kitchen': ['Furniture', 'Appliances', 'Decor'],
            'Sports &Fitness': ['Gym Equipment', 'Outdoor Sports', 'Wearables'],
          },
        },
      });
    }
  } catch (error) {
    console.error('Error initializing site config', error);
  }
};

export default initializeConfig;

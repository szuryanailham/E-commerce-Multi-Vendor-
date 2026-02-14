import prisma from '@e-commerce-multi-vendor/prisma';

export const updateUserAnalytics = async (event: any) => {
  try {
    const existingData = await prisma.userAnalytics.findUnique({
      where: {
        userId: event.userId,
      },
    });

    let updateActions: any = existingData?.actions || [];

    const actionExists = updateActions.some(
      (entry: any) =>
        entry.productId === event.productId && entry.action === event.action,
    );

    if (event.action === 'product_view') {
      updateActions.push({
        productId: event?.productId,
        shopId: event.shopId,
        action: 'product_view',
        timestamp: new Date(),
      });
    } else if (
      ['add_to_cart', 'add_to_wishlist'].includes(event.action) &&
      !actionExists
    ) {
      updateActions.push({
        productId: event?.productId,
        shopId: event.shopId,
        action: event?.action,
        timestamp: new Date(),
      });
    } else if (event.action === 'remove_from_cart') {
      updateActions = updateActions.filter(
        (entry: any) =>
          !(
            entry.productId === event.productId &&
            entry.action === 'add_to_cart'
          ),
      );
    }

    if (updateActions.length > 100) {
      updateActions = updateActions.slice(-100);
    }

    const extraFields: Record<string, any> = {};
    if (event.country) {
      extraFields.country = event.country;
    }
    if (event.city) {
      extraFields.city = event.city;
    }
    if (event.device) {
      extraFields.device = event.device;
    }

    // update or create user analytics
    await prisma.userAnalytics.upsert({
      where: { userId: event.userId },
      update: {
        lastVisited: new Date(),
        actions: updateActions,
        ...extraFields,
      },
      create: {
        userId: event?.userId,
        lastVisited: new Date(),
        actions: updateActions,
        ...extraFields,
      },
    });
    // also update prooduct analytics
    await updateProductAnalytics(event);
  } catch (error) {
    console.error('Error updating user analytics:', error);
  }
};

export const updateProductAnalytics = async (event: any) => {
  try {
    if (!event.productId) return;

    // Define update feilds dynamically
    const updatedFields: any = {};
    if (event.action === 'product_view') updatedFields.views = { increment: 1 };
    if (event.action === 'add_to_cart') {
      updatedFields.cartAdds = { increment: 1 };
    }
  } catch (error) {}
};

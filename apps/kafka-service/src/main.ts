import { kafka } from '@e-commerce-multi-vendor/utils';

const cosumer = kafka.consumer({ groupId: 'user-events-group' });

const eventQueue: any[] = [];

const processQueue = async () => {
  if (eventQueue.length === 0) return;
  const events = [...eventQueue];
  eventQueue.length = 0;

  for (const event of events) {
    if (event.action === 'shop_visit') {
      // update shop analytics
    }
    const validActions = [
      'add_to_wistlist',
      'add_to_cart',
      'product_view',
      'remove_from_wishlist',
    ];
    if (!event.action || !validActions.includes(event.action)) {
      continue;
    }

    try {
      await updateUserAnalytics(event);
    } catch (error) {
      console.log('Error processing event :', error);
    }
  }
};

setInterval(processQueue, 3000);

// kafka cosmuer for user events

export const consumeKafkaMessages = async () => {
  // connect to the kafka broker
  await cosumer.connect();
  await cosumer.subscribe({ topic: 'users-events', fromBeginning: false });

  await cosumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const event = JSON.parse(message.value.toString());
      eventQueue.push(event);
    },
  });
};

consumeKafkaMessages().catch(console.error);

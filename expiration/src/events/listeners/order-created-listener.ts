import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@geetix/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/exipration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, expiresAt } = data;
    const delay = new Date(expiresAt).getTime() - new Date().getTime();

    console.log(`Waiting ${delay} before cancelling order: ${orderId}`);

    await expirationQueue.add({ orderId }, { delay });
    msg.ack();
  }
}

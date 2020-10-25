import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects
} from '@geetix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error(`Order with id ${data.orderId} does not exist`);
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}

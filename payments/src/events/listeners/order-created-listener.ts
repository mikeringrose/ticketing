import { Listener, OrderCreatedEvent, Subjects } from '@geetix/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = await Order.build({
      id: data.id,
      version: data.version,
      status: data.status,
      price: data.ticket.price,
      userId: data.userId
    }).save();
    msg.ack();
  }
}

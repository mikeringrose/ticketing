import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@geetix/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error(`Ticket with id ${data.ticket.id} does not exist`);
    }

    if (ticket.orderId) {
      throw new Error(`Unable to reserve ticket with id ${data.ticket.id}`);
    }

    ticket.set({ orderId: data.id });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      orderId: ticket.orderId,
      userId: ticket.userId
    });

    msg.ack();
  }
}

import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@geetix/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw Error(`Ticket with id: ${id} not found`);
    }

    ticket.set({ title, price });
    await ticket.save();
    await msg.ack();
  }
}

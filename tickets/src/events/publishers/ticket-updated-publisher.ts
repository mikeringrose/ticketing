import { Publisher, Subjects, TicketUpdatedEvent } from '@geetix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

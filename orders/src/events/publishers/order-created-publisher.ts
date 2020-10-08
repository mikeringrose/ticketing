import { Publisher, Subjects, OrderCreatedEvent } from '@geetix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

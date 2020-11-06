import { Publisher, Subjects, OrderCancelledEvent } from '@geetix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

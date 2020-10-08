import { Publisher, Subjects, OrderCancelledEvent } from '@geetix/common';

export class OrderCancelledPushlisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

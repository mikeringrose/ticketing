import { PaymentCreatedEvent, Publisher, Subjects } from '@geetix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}

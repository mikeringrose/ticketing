import { ExpirationCompleteEvent, Publisher, Subjects } from '@geetix/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}

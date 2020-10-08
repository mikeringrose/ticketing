import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const createTicket = () =>
  request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'asdf', price: 20 });

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);
});

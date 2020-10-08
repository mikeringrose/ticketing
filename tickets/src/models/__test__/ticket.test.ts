import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = await Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asdfasdf'
  }).save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 15 });
  secondInstance!.set({ price: 20 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should have had a concurrency issue');
});

it('increments the version number on multiple saves', async () => {
  const ticket = await Ticket.build({
    title: 'concert',
    price: 10,
    userId: 'asdfasdf'
  }).save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

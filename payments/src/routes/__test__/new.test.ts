import { OrderStatus } from '@geetix/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when purchasing an error that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asdf', orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('returns a 401 when purchasing an that does not belong to that user', async () => {
  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created
  }).save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({ token: 'asdf', orderId: order.id })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    userId,
    status: OrderStatus.Cancelled
  }).save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'asdf', orderId: order.id })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = await Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    userId,
    status: OrderStatus.Created
  }).save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: 'abcdef'
  });
  expect(payment).not.toBeNull();
});

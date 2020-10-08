import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest
} from '@geetix/common';
import { param } from 'express-validator';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  [
    param('orderId')
      .custom((orderId) => mongoose.Types.ObjectId.isValid(orderId))
      .withMessage('Must be a valid order id')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };

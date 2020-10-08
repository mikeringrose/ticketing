import express, { Request, Response } from 'express';
import { NotFoundError } from '@geetix/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    res.status(200).send(ticket);
  } catch (err) {
    throw new NotFoundError();
  }
});

export { router as showTicketRouter };

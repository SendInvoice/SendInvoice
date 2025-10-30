import {
  validateItemId,
  validateUUID
} from '../../../../utils/uuid';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateInvoiceDto, CreateInvoiceItemDto, UpdateInvoiceItemDto } from '../../service';
import type { Invoice } from '../../entities/Invoice';

type Params = {
  id: string;
};

type ItemParams = {
  id: string;
  itemId: string;
};

type InvoiceParams = {
  id: string;
};

type DefaultQuery = {
  companyId?: string;
};

export const apiV1InvoiceRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

  fastify.get<{ Querystring: DefaultQuery }>('/', async (request, reply) => {
    const companyId = request.query.companyId;

    if (!companyId) {
      return reply.status(400).send({ message: 'companyId query parameter is required' });
    }

    const invoices = await fastify.domain.invoice.find({
      companyId
    });
    return reply.status(200).send(invoices);
  });

  fastify.get<{ Params: Params }>(
    '/:id',
    { preHandler: validateUUID() },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const invoice = await fastify.domain.invoice.findById(id);

        if (!invoice) {
          request.log.info(`Invoice not found for id: ${id}`);
          return reply.status(404).send({ message: 'Invoice not found' });
        }

        return reply.status(200).send(invoice);
      } catch (err) {
        request.log.error({ err }, 'Error while fetching invoice');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  fastify.post<{ Body: CreateInvoiceDto }>('/', async (request, reply) => {
    const body = request.body;

    if (!body.invoiceNumber?.trim()) {
      return reply.status(400).send({
        message: 'Invoice number is required and cannot be empty'
      });
    }

    if (!body?.items || body.items.length === 0) {
      return reply.status(400).send({ message: 'At least one item is required' });
    }

    try {
      const created = await fastify.domain.invoice.createInvoice(body);
      return reply.status(201).send(created);
    } catch (err: any) {
      const known = [
        'Bill to address not found',
        'Ship to address not found',
        'Company not found',
        'Recipient not found'
      ];
      if (known.includes(err?.message)) {
        return reply.status(400).send({ message: err.message });
      }
      request.log.error({ err }, 'Error creating invoice');
      return reply.status(500).send({ message: 'Unexpected error creating invoice' });
    }
  });

  fastify.put<{ Params: Params; Body: Partial<Invoice> }>(
    '/:id',
    { preHandler: validateUUID() },
    async (request, reply) => {
      const { id } = request.params;
      const data = request.body;

      if ('items' in data) {
        return reply
          .status(400)
          .send({ message: 'Updating items from this endpoint is not supported' });
      }
      try {
        const updated = await fastify.domain.invoice.updateById(id, data);
        if (!updated)
          return reply.status(404).send({ message: 'Invoice not found or not updated' });

        return reply.status(200).send(updated);
      } catch (error) {
        request.log.error({ error }, 'Error updating invoice');

        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  fastify.delete<{ Params: Params }>(
    '/:id',
    { preHandler: validateUUID() },
    async (request, reply) => {
      const { id } = request.params;
      try {
        const deleted = await fastify.domain.invoice.deleteById(id);
        if (!deleted) return reply.status(404).send({ message: 'Invoice not found' });

        return reply.status(200).send({ message: 'Invoice deleted successfully' });
      } catch (error) {
        request.log.error({ error }, 'Error deleting invoice');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  //Routes for items

  fastify.get<{ Params: InvoiceParams }>(
    '/:id/item',
    { preHandler: validateUUID() },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const items = await fastify.domain.invoice.findInvoiceItems(id);

        return reply.status(200).send({
          invoiceId: id,
          totalItems: items.length,
          items
        });
      } catch (err: any) {
        if (err.message === 'Invoice not found') {
          return reply.status(404).send({ message: 'Invoice not found' });
        }

        request.log.error({ err }, 'Error while fetching invoice items');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  fastify.get<{ Params: ItemParams }>(
    '/:id/item/:itemId',
    { preHandler: [validateUUID(), validateItemId()] },
    async (request, reply) => {
      try {
        const { id, itemId } = request.params;
        const item = await fastify.domain.invoice.findInvoiceItemById(id, itemId);

        if (!item) {
          return reply.status(404).send({ message: 'Invoice item not found' });
        }

        return reply.status(200).send(item);
      } catch (err) {
        request.log.error({ err }, 'Error while fetching invoice item');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  fastify.post<{ Params: InvoiceParams; Body: CreateInvoiceItemDto }>(
    '/:id/item',
    { preHandler: validateUUID() },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const body = request.body;

        if (!body.description?.trim()) {
          return reply.status(400).send({ message: 'Description is required and cannot be empty' });
        }

        if (body.quantity == null || body.quantity <= 0) {
          return reply.status(400).send({ message: 'Quantity must be greater than 0' });
        }

        if (body.unitPrice == null || body.unitPrice < 0) {
          return reply.status(400).send({ message: 'Unit price cannot be negative' });
        }

        const itemData = {
          ...body,
          amount: body.quantity * body.unitPrice
        };

        const createdItem = await fastify.domain.invoice.createInvoiceItem(id, itemData);
        return reply.status(201).send(createdItem);
      } catch (err: any) {
        if (err.message === 'Invoice not found') {
          return reply.status(404).send({ message: 'Invoice not found' });
        }

        request.log.error({ err }, 'Error creating invoice item');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  fastify.put<{ Params: ItemParams; Body: UpdateInvoiceItemDto }>(
    '/:id/item/:itemId',
    { preHandler: [validateUUID(), validateItemId()] },
    async (request, reply) => {
      try {
        const { id, itemId } = request.params;
        const data = request.body;

        if (data.quantity !== undefined && data.quantity <= 0) {
          return reply.status(400).send({ message: 'Quantity must be greater than 0' });
        }

        if (data.unitPrice !== undefined && data.unitPrice < 0) {
          return reply.status(400).send({ message: 'Unit price cannot be negative' });
        }

        if (data.description !== undefined && !data.description.trim()) {
          return reply.status(400).send({ message: 'Description cannot be empty' });
        }

        const updated = await fastify.domain.invoice.updateInvoiceItemById(id, itemId, data);

        if (!updated) {
          return reply.status(404).send({ message: 'Invoice item not found' });
        }

        return reply.status(200).send(updated);
      } catch (err) {
        request.log.error({ err }, 'Error updating invoice item');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  fastify.delete<{ Params: ItemParams }>(
    '/:id/item/:itemId',
    { preHandler: [validateUUID(), validateItemId()] },
    async (request, reply) => {
      try {
        const { id, itemId } = request.params;
        const deleted = await fastify.domain.invoice.deleteInvoiceItemById(id, itemId);

        if (!deleted) {
          return reply.status(404).send({ message: 'Invoice item not found' });
        }

        return reply.status(200).send({ message: 'Invoice item deleted successfully' });
      } catch (err) {
        request.log.error({ err }, 'Error deleting invoice item');
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );

  done();
};

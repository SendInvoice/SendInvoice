import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateInvoiceDto, CreateInvoiceItemDto, UpdateInvoiceItemDto } from '../../service';
import type { Invoice } from '../../entities/Invoice';

type Params = {
    id: string;
};

type ItemParams = {
    id: string;
    itemId: string
};

type InvoiceParams = {
    id: string;
};

export const apiV1InvoiceRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

    fastify.get('/', async (_, reply) => {
        const invoices = await fastify.domain.invoice.find();
        return reply.status(200).send(invoices);
    });

    fastify.get<{ Params: Params }>('/:id', async (request, reply) => {
        try {
            const { id } = request.params;

            if (!id || !/^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/.test(id)) {
                request.log.warn(`Invalid invoice id received: ${id}`);
                return reply.status(400).send({ message: 'Invalid or missing invoice ID' });
            }

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
    });

    fastify.get<{ Params: { userId: string } }>('/:userId', async (request, reply) => {
        try {
            const { userId } = request.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(userId)) {
                return reply.status(400).send({ message: 'Invalid user ID format' });
            }

            const userInvoices = await fastify.domain.invoice.findByUserId(userId);

            return reply.status(200).send({
                userId,
                totalInvoices: userInvoices.length,
                invoices: userInvoices
            });
        } catch (error: any) {
            request.log.error({ error }, 'Error fetching user invoices');
            return reply.status(500).send({
                message: 'Error fetching user invoices',
                error: error.message
            });
        }
    });

    fastify.get<{ Params: { companyId: string } }>('/:companyId', async (request, reply) => {
        try {
            const { companyId } = request.params;

            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(companyId)) {
                return reply.status(400).send({ message: 'Invalid company ID format' });
            }

            const companyInvoices = await fastify.domain.invoice.findByCompanyId(companyId);

            return reply.status(200).send({
                companyId,
                totalInvoices: companyInvoices.length,
                invoices: companyInvoices
            });
        } catch (error: any) {
            request.log.error({ error }, 'Error fetching company invoices');
            return reply.status(500).send({
                message: 'Error fetching company invoices',
                error: error.message
            });
        }
    });

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

    fastify.put<{ Params: Params; Body: Partial<Invoice> }>('/:id', async (request, reply) => {
        const { id } = request.params;
        const data = request.body;

        if (!id) return reply.status(400).send({ message: 'Id is required' });
        if ('items' in data) {
            return reply.status(400).send({ message: 'Updating items from this endpoint is not supported' });
        }

        const updated = await fastify.domain.invoice.updateById(id, data);
        if (!updated) {
            return reply.status(404).send({ message: 'Invoice not found or not updated' });
        }
        return reply.status(200).send(updated);
    });


    fastify.delete<{ Params: Params }>('/:id', async (request, reply) => {
        const { id } = request.params;
        if (!id) return reply.status(400).send({ message: 'Id is required' });

        const deleted = await fastify.domain.invoice.deleteById(id);
        if (!deleted) return reply.status(404).send({ message: 'Invoice not found' });

        return reply.status(200).send({ message: 'Invoice deleted successfully' });
    });

    //Routes for items
    
    fastify.get<{ Params: InvoiceParams }>('/:id/item', async (request, reply) => {
        try {
            const { id } = request.params;

            if (!id || !/^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/.test(id)) {
                request.log.warn(`Invalid invoice id received: ${id}`);
                return reply.status(400).send({ message: 'Invalid or missing invoice ID' });
            }

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
    });

    fastify.get<{ Params: ItemParams }>('/:id/item/:itemId', async (request, reply) => {
        try {
            const { id, itemId } = request.params;

            const uuidRegex = /^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/;

            if (!uuidRegex.test(id)) {
                return reply.status(400).send({ message: 'Invalid invoice ID format' });
            }

            if (!uuidRegex.test(itemId)) {
                return reply.status(400).send({ message: 'Invalid item ID format' });
            }

            const item = await fastify.domain.invoice.findInvoiceItemById(id, itemId);

            if (!item) {
                return reply.status(404).send({ message: 'Invoice item not found' });
            }

            return reply.status(200).send(item);
        } catch (err) {
            request.log.error({ err }, 'Error while fetching invoice item');
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });

    fastify.post<{ Params: InvoiceParams; Body: CreateInvoiceItemDto }>('/:id/item', async (request, reply) => {
        try {
            const { id } = request.params;
            const body = request.body;

            if (!id || !/^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/.test(id)) {
                return reply.status(400).send({ message: 'Invalid or missing invoice ID' });
            }

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
    });

    fastify.put<{ Params: ItemParams; Body: UpdateInvoiceItemDto }>('/:id/item/:itemId', async (request, reply) => {
        try {
            const { id, itemId } = request.params;
            const data = request.body;

            const uuidRegex = /^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/;

            if (!uuidRegex.test(id)) {
                return reply.status(400).send({ message: 'Invalid invoice ID format' });
            }

            if (!uuidRegex.test(itemId)) {
                return reply.status(400).send({ message: 'Invalid item ID format' });
            }

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
    });

    fastify.delete<{ Params: ItemParams }>('/:id/item/:itemId', async (request, reply) => {
        try {
            const { id, itemId } = request.params;

            
            const uuidRegex = /^[0-9a-fA-F-]{8}-[0-9a-fA-F-]{4}-[1-5][0-9a-fA-F-]{3}-[89abAB][0-9a-fA-F-]{3}-[0-9a-fA-F-]{12}$/;

            if (!uuidRegex.test(id)) {
                return reply.status(400).send({ message: 'Invalid invoice ID format' });
            }

            if (!uuidRegex.test(itemId)) {
                return reply.status(400).send({ message: 'Invalid item ID format' });
            }

            const deleted = await fastify.domain.invoice.deleteInvoiceItemById(id, itemId);

            if (!deleted) {
                return reply.status(404).send({ message: 'Invoice item not found' });
            }

            return reply.status(200).send({ message: 'Invoice item deleted successfully' });
        } catch (err) {
            request.log.error({ err }, 'Error deleting invoice item');
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });

    done();

}

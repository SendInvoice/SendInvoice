import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { Recipient } from '../../entities/Recipient';
import type { CreateRecipientDto } from '../../service/RecipientService';
import { validateUUID } from '../../../../utils/uuid';

type Params = {
  id: string;
};

export const apiV1RecipientRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

  fastify.get('/', async (_, reply) => {
    const allRecipients = await fastify.domain.invoice.recipient.find();
    return reply.status(200).send(allRecipients);
  });

  fastify.get<{ Params: Params }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    try {
      const { id } = request.params;
      const recipient = await fastify.domain.invoice.recipient.findById(id);

      if (!recipient) {
        request.log.info(`Recipient not found for id: ${id}`);
        return reply.status(404).send({ message: 'Recipient not found' });
      }

      return reply.status(200).send(recipient);
    } catch (err) {
      request.log.error({ err }, 'Error while fetching recipient');
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateRecipientDto;
    const result = await fastify.domain.invoice.recipient.createRecipient(reqBody);

    return reply.status(201).send(result);
  });

  fastify.put<{ Params: Params; Body: Partial<Recipient> }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    const { id } = request.params;
    const data = request.body;
    
    try {
      const updated = await fastify.domain.invoice.recipient.updateById(id, data);
      if (!updated) return reply.status(404).send({ message: 'Recipient not found' });

      return reply.status(200).send(updated);

    } catch (error) {
      request.log.error({ error }, 'Error updating recipient');

      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: Params }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    const { id } = request.params;

    try {
      const deleted = await fastify.domain.invoice.recipient.deleteById(id);
      if (!deleted) return reply.status(404).send({ message: 'Recipient not found' });

      return reply.status(200).send({ message: 'Recipient deleted successfully' });

    } catch (error) {
      request.log.error({ error }, 'Error deleting recipient');

      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  done();
};

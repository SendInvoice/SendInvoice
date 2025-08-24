import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { Recipient } from '../../entities/Recipient';
import type { CreateRecipientDto } from '../../service/RecipientService';

type Params = {
  id: string;
};

export const apiV1RecipientRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
    
  // get all recipients
  fastify.get('/', async (_, reply) => {
    const allRecipients = await fastify.domain.invoice.recipient.find();
    return reply.status(200).send(allRecipients);
  });

  // create a new recipient
  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateRecipientDto;
    const result = await fastify.domain.invoice.recipient.createRecipient(reqBody);

    return reply.status(201).send(result);
  });

  // find a recipient by id
  fastify.get<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request.params.id;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const maybeRecipient = await fastify.domain.invoice.recipient.findById(id);

    if (!maybeRecipient) {
      return reply.status(404).send({ message: 'Recipient not found' });
    }

    return reply.status(200).send(maybeRecipient);
  });

  // update recipient by id
  fastify.put<{ Params: Params; Body: Partial<Recipient> }>('/:id', async (request, reply) => {
    const id = request.params.id;
    const data = request.body;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const updated = await fastify.domain.invoice.recipient.updateById(id, data);

    if (!updated) {
      return reply.status(404).send({ message: 'Recipient not found or not updated' });
    }

    return reply.status(200).send(updated);
  });

  // delete recipient by id
  fastify.delete<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request.params.id;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const deleted = await fastify.domain.invoice.recipient.deleteById(id);

    if (!deleted) {
      return reply.status(404).send({ message: 'Recipient not found' });
    }

    return reply.status(200).send({ message: 'Recipient deleted successfully' });
  });

  done();
};

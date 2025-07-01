import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateNameDto } from '../service';

export const apiV1NamesRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/', async (_, reply) => {
    const result = await fastify.domain.names.getNames();
    return reply.status(200).send(result);
  });

  fastify.get('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const maybeName = await fastify.domain.names.getNameById(id);

    if (!maybeName) {
      return reply.status(400).send({ message: 'Name not found' });
    }

    return reply.status(200).send(maybeName);
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = JSON.parse(request.body as string) as CreateNameDto;
    const result = await fastify.domain.names.createName({
      name: reqBody.name,
      birthDate: reqBody.birthDate,
      deathDate: reqBody.deathDate,
      professions: reqBody.professions
    });

    return reply.status(201).send(result);
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request?.params as unknown as { id?: string })?.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    await fastify.domain.names.deleteName(id);

    return reply.status(200).send({ message: 'Name deleted' });
  });

  done();
};

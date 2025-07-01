import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateTitleDto } from '../service';

export const apiV1TitlesRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/', async (_, reply) => {
    const result = await fastify.domain.titles.getTitles();
    return reply.status(200).send(result);
  });

  fastify.get('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const maybeTitle = await fastify.domain.titles.getTitleById(id);

    if (!maybeTitle) {
      return reply.status(400).send({ message: 'Title not found' });
    }

    return reply.status(200).send(maybeTitle);
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = JSON.parse(request.body as string) as CreateTitleDto;
    const result = await fastify.domain.titles.createTitle({
      title: reqBody.title,
      releaseDate: reqBody.releaseDate,
      starRating: reqBody.starRating,
      audienceRating: reqBody.audienceRating,
      contentType: reqBody.contentType,
      coverImageId: reqBody.coverImageId,
    });

    return reply.status(201).send(result);
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request?.params as unknown as { id?: string })?.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    await fastify.domain.titles.deleteTitle(id);

    return reply.status(200).send({ message: 'Title deleted' });
  });

  done();
};

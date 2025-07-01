import { open } from 'node:fs/promises';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { MimeType } from '../entity';

export const apiV1ImagesRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({
        message: 'Id is required'
      });
    }

    const image = await fastify.domain.images.findImage(id);

    if (!image) {
      return reply.status(400).send({
        message: 'Image not found'
      });
    }

    const path = fastify.domain.images.makeImagePath(image);
    const fd = await open(path, 'r');
    const stream = fd.createReadStream();

    return reply.type(image.mimeType).send(stream);
  });

  fastify.post('/', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      return reply.status(400).send({
        message: 'No file uploaded'
      });
    }

    const buffer = await file.toBuffer();
    const mimeType = file.mimetype as MimeType;
    const id = await fastify.domain.images.createImage(buffer, {
      mimeType,
    });

    return reply.status(201).send({
      id,
    });
  });

  done();
};

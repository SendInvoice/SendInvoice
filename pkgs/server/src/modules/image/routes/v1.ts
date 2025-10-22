import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { ImagePurpose } from '../entity';

export const apiV1ImageRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.post('/', async (request, reply) => {
    const multipartFile = await request.file();
    const bytes = await multipartFile?.toBuffer()

    if (!bytes) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const size = bytes.length;
    const mimeType = multipartFile?.mimetype;
    const file = multipartFile?.file;

    if (!file || !mimeType || !size) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const image = await fastify.domain.image.uploadImage({
      bytes,
      mimeType,
      size,
      width: 0,
      height: 0,
      purpose: ImagePurpose.CompanyLogo,
    });

    return reply.status(201).send({
      id: image.id,
    });
  });

  done();
};

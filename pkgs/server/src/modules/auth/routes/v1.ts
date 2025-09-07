import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const apiV1AuthRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/whoami', async (request, reply) => {
    const currentUser = request.user;
    return reply.status(200).send(currentUser);
  });

  fastify.post('/sign-up', async (request, reply) => {
    const reqBody = request.body as { email: string };
    const result = await fastify.domain.auth.createToken(reqBody.email);

    return reply.status(201).send(result);
  });

  fastify.post('/log-in', async (request, reply) => {
    const reqBody = request.body as { email: string };
    const result = await fastify.domain.auth.createToken(reqBody.email);

    return reply.status(201).send(result);
  });

  done();
};

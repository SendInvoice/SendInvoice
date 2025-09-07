import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import { domainServicesPlugin } from './plugins/domain';
import { apiV1RouterPlugin } from './plugins/router';

import type { FastifyInstance } from 'fastify';
import type { IUser } from '../modules/user/entity';

export async function makeServer(): Promise<FastifyInstance> {
  const server = fastify({ logger: true });

  await server.register(multipart);
  await server.register(domainServicesPlugin);
  await server.register(apiV1RouterPlugin);
  await server.register(cors, {
    // This is NOT recommended for production as it enables reflection exploits
    origin: true
  });

  server.addHook('onRequest', async (request, reply) => {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return;
    }

    const apiKey = authorization.split(' ');

    if (apiKey.length !== 2) {
      return;
    }

    if (apiKey[0].toLowerCase() !== 'bearer') {
      return;
    }

    const tokenStr = apiKey[1];
    const token = await server.domain.auth.findByToken(tokenStr);

    if (!token?.user) {
      return;
    }

    const user: IUser = {
      id: token?.user.id,
      name: token?.user.name,
      surname: token?.user.surname,
      email: token?.user.email,
      createdAt: token?.user.createdAt,
      updatedAt: token?.user.updatedAt
    };

    token?.user && (request.user = user);
  });

  return server;
}

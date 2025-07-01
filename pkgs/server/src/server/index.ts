import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import { domainServicesPlugin } from './plugins/domain';
import { apiV1RouterPlugin } from './plugins/router';

import type { FastifyInstance } from 'fastify';

export async function makeServer(): Promise<FastifyInstance> {
  const server = fastify({ logger: true });

  await server.register(multipart);
  await server.register(domainServicesPlugin);
  await server.register(apiV1RouterPlugin);
  await server.register(cors, {
    // This is NOT recommended for production as it enables reflection exploits
    origin: true
  });

  return server;
}

import fp from 'fastify-plugin';

import { userRoutes } from '../../modules/user';

import type { FastifyInstance } from 'fastify';

export const apiV1RouterPlugin = fp(
  (fastify: FastifyInstance, _, done) => {
    fastify.register(userRoutes.v1, {
      prefix: '/api/v1/user'
    });

    done();
  },
  {
    name: 'router'
  }
);

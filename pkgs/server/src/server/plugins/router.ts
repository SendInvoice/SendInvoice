import fp from 'fastify-plugin';

import { apiV1UserRouter } from '../../modules/user/routes/v1';

import type { FastifyInstance } from 'fastify';

export const apiV1RouterPlugin = fp(
  (fastify: FastifyInstance, _, done) => {
    fastify.register(apiV1UserRouter, {
      prefix: '/api/v1/user'
    });

    done();
  },
  {
    name: 'router'
  }
);

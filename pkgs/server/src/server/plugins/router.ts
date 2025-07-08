import fp from 'fastify-plugin';

import { userRoutes } from '../../modules/user';

import type { FastifyInstance } from 'fastify';
import { cvRoutes } from '../../modules/cv';

export const apiV1RouterPlugin = fp(
  (fastify: FastifyInstance, _, done) => {
    fastify.register(cvRoutes.v1, {
      prefix: '/api/v1/cv'
    });

    fastify.register(userRoutes.v1, {
      prefix: '/api/v1/user'
    });

    done();
  },
  {
    name: 'router'
  }
);

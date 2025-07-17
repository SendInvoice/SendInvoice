import fp from 'fastify-plugin';

import { userRoutes } from '../../modules/user';

import type { FastifyInstance } from 'fastify';
import { invoiceRoutes } from '../../modules/invoice';

export const apiV1RouterPlugin = fp(
  (fastify: FastifyInstance, _, done) => {
    fastify.register(invoiceRoutes.v1, {
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

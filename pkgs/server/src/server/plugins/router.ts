import fp from 'fastify-plugin';

import { authRoutes } from '../../modules/auth';
import { invoiceRoutes } from '../../modules/invoice';
import { userRoutes } from '../../modules/user';

import type { FastifyInstance } from 'fastify';

export const apiV1RouterPlugin = fp(
  (fastify: FastifyInstance, _, done) => {
    fastify.register(authRoutes.v1, {
    prefix: '/api/v1/auth'
    });

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

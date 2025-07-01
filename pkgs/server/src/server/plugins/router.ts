import fp from 'fastify-plugin';

import { apiV1ImagesRouter } from '../../modules/images/routes/v1';
import { apiV1NamesRouter } from '../../modules/names/routes/v1';
import { apiV1TitlesRouter } from '../../modules/title/routes/v1';

import type { FastifyInstance } from 'fastify';

export const apiV1RouterPlugin = fp(
  (fastify: FastifyInstance, _, done) => {
    fastify.register(apiV1ImagesRouter, {
      prefix: '/api/v1/images'
    });
    
    fastify.register(apiV1NamesRouter, {
      prefix: '/api/v1/names'
    });

    fastify.register(apiV1TitlesRouter, {
      prefix: '/api/v1/titles'
    });

    done();
  },
  {
    name: 'router'
  }
);

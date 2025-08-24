import { apiV1AddressRouter } from './address';
import { apiV1CompanyRouter } from './company';
import { apiV1RecipientRouter } from './recipients';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const apiV1InvoiceRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

    fastify.register(apiV1AddressRouter, {
        prefix: '/address'
    });

    fastify.register(apiV1CompanyRouter, {
        prefix: '/company'
    });

    fastify.register(apiV1RecipientRouter, {
        prefix: '/recipients'
    });

    done();
};

import 'fastify';

import { DOMAIN_SERVICES_PLUGIN_NAME } from './server/plugins/domain';

import type { DomainServices } from './server/plugins/domain';

declare module 'fastify' {
  interface FastifyInstance {
    [DOMAIN_SERVICES_PLUGIN_NAME]: DomainServices;
  }
}

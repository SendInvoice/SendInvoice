import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { Company } from '../../entities/Company';
import type { CreateCompanyDto } from '../../service/CompanyService';
import { validateUUID } from '../../../../utils/uuid';

type Params = {
  id: string;
};

export const apiV1CompanyRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

  fastify.get('/', async (_, reply) => {
    const allCompanies = await fastify.domain.invoice.company.find();
    return reply.status(200).send(allCompanies);
  });

  fastify.get<{ Params: Params }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    try {
      const { id } = request.params;
      const company = await fastify.domain.invoice.company.findById(id);

      if (!company) {
        request.log.info(`Company not found for id: ${id}`);
        return reply.status(404).send({ message: 'Company not found' });
      }

      return reply.status(200).send(company);
    } catch (err) {
      request.log.error({ err }, 'Error while fetching company');
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateCompanyDto;
    const result = await fastify.domain.invoice.company.createCompany(reqBody);

    return reply.status(201).send(result);
  });

  fastify.put<{ Params: Params; Body: Partial<Company> }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    const { id } = request.params;
    const data = request.body;

    try {
      const updated = await fastify.domain.invoice.company.updateById(id, data);
      if (!updated) return reply.status(404).send({ message: 'Company not found' });

      return reply.status(200).send(updated);

    } catch (error) {
      request.log.error({ error }, 'Error updating company');

      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: Params }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    const { id } = request.params;

    try {
      const deleted = await fastify.domain.invoice.company.deleteById(id);
      if (!deleted) return reply.status(404).send({ message: 'Company not found' });

      return reply.status(200).send({ message: 'Company deleted successfully' });
    } catch (error) {
      request.log.error({ error }, 'Error deleting company');
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  done();
};

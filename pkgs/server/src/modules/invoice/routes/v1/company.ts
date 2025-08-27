import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { Company } from '../../entities/Company';
import type { CreateCompanyDto } from '../../service/CompanyService';

type Params = {
  id: string;
};

export const apiV1CompanyRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
    
  fastify.get('/', async (_, reply) => {
    const allCompanies = await fastify.domain.invoice.company.find();
    return reply.status(200).send(allCompanies);
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateCompanyDto;
    const result = await fastify.domain.invoice.company.createCompany(reqBody);

    return reply.status(201).send(result);
  });

  fastify.get<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const maybeCompany = await fastify.domain.invoice.company.findById(id);

    if (!maybeCompany) {
      return reply.status(404).send({ message: 'Company not found' });
    }

    return reply.status(200).send(maybeCompany);
  });

  fastify.put<{ Params: Params; Body: Partial<Company> }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;
    const data = request.body;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const updated = await fastify.domain.invoice.company.updateById(id, data);

    if (!updated) {
      return reply.status(404).send({ message: 'Company not found or not updated' });
    }

    return reply.status(200).send(updated);
  });

  fastify.delete<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const deleted = await fastify.domain.invoice.company.deleteById(id);

    if (!deleted) {
      return reply.status(404).send({ message: 'Company not found' });
    }

    return reply.status(200).send({ message: 'Company deleted successfully' });
  });

  done();
};

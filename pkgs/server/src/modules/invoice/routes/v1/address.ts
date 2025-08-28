import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateAddressDto } from '../../service/AddressService';
import type { Address } from '../../entities/Address';
import { validateUUID } from '../../../../utils/uuid';

type Params = {
  id: string;
};

export const apiV1AddressRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

  fastify.get('/', async (_, reply) => {
    const allAddresses = await fastify.domain.invoice.address.find();

    return reply.status(200).send(allAddresses);
  });

  fastify.get<{ Params: Params }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    try {
      const { id } = request.params;
      const address = await fastify.domain.invoice.address.findById(id);

      if (!address) {
        request.log.info(`Address not found for id: ${id}`);
        return reply.status(404).send({ message: 'Address not found' });
      }

      return reply.status(200).send(address);
    } catch (err) {
      request.log.error({ err }, 'Error while fetching address');
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateAddressDto;
    const result = await fastify.domain.invoice.address.createAddress(reqBody);

    return reply.status(201).send(result);
  });


  fastify.put<{ Params: Params; Body: Partial<Address> }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    const { id } = request.params;
    const data = request.body;

    try {
      const updated = await fastify.domain.invoice.address.updateById(id, data);
      if (!updated) return reply.status(404).send({ message: 'Address not found or not updated' });

      return reply.status(200).send(updated);

    } catch (error) {
      request.log.error({ error }, 'Error updating company');

      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  fastify.delete<{ Params: Params }>('/:id', {preHandler: validateUUID()}, async (request, reply) => {
    const { id } = request.params;
    
    try {
      const deleted = await fastify.domain.invoice.address.deleteById(id);
      if (!deleted) return reply.status(404).send({ message: 'Address not found' });

      return reply.status(200).send({ message: 'Address deleted successfully' });
    } catch (error) {
      request.log.error({ error }, 'Error deleting address');
      return reply.status(500).send({ message: 'Internal server error' });
    }
  });

  done();
};


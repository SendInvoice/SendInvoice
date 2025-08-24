import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateAddressDto } from '../../service/AddressService';
import type { Address } from '../../entities/Address';

type Params = {
  id: string;
};

export const apiV1AddressRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {

  //get all addresses.
  fastify.get('/', async (_, reply) => {
    const allAddresses = await fastify.domain.invoice.address.find();
    return reply.status(200).send(allAddresses);
  });

  //creates an Address.
  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateAddressDto;
    const result = await fastify.domain.invoice.address.createAddress(reqBody);

    return reply.status(201).send(result);
  });

  //finds an address by id.
  fastify.get<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const maybeAddress = await fastify.domain.invoice.address.findById(id);

    return reply.status(200).send(maybeAddress);
  });

  // update an address by id
  fastify.put<{ Params: Params; Body: Partial<Address> }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;
    const data = request.body;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const updated = await fastify.domain.invoice.address.updateById(id, data);

    if (!updated) {
      return reply.status(404).send({ message: 'Address not found or not updated' });
    }

    return reply.status(200).send(updated);
  });

  // delete address by id
  fastify.delete<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const deleted = await fastify.domain.invoice.address.deleteById(id);

    if (!deleted) {
      return reply.status(404).send({ message: 'Address not found' });
    }

    return reply.status(200).send({ message: 'Address deleted successfully' });
  });

  done();
};


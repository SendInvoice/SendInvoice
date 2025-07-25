import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateUserDto } from '../service';

type Params = {
  id: string;
};

export const apiV1UserRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
  fastify.get('/whoami', async (request, reply) => {
    const headers = request.headers;
    const authHeader = headers.authorization;

    if (authHeader?.toLowerCase()?.startsWith('bearer')) {
      const parts = authHeader.split(' ');
      const tokenStr = parts[1];

      if (!tokenStr) {
        return reply.code(401).send({
          message: 'Unauthorized.'
        });
      }

      const maybeToken = await fastify.domain.auth.findByToken(tokenStr);

      if (!maybeToken) {
        return reply.code(401).send({
          message: 'Unauthorized. Invalid token.'
        });
      }

      if (Array.isArray(maybeToken) && maybeToken.length != 1) {
        if (!maybeToken.length) {
          return reply.code(401).send({
            message: 'Unauthorized. Invalid token.'
          });
        }

        return reply.code(500).send({
          message: 'More than one token was found in the response.'
        });
      }

      const token = maybeToken[0];

      if (!token.user) {
        return reply.code(500).send({
          message: 'User was not found in the response.'
        });
      }

      return token.user;
    }

    const result = await fastify.domain.user.getUser();
    return reply.status(200).send(result);
  });

  fastify.get<{ Params: Params }>('/:id', async (request, reply) => {
    const id = request?.params.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    const maybeUser = await fastify.domain.user.findBy(id);

    if (!maybeUser) {
      return reply.status(400).send({ message: 'Title not found' });
    }

    return reply.status(200).send(maybeUser);
  });

  fastify.post('/', async (request, reply) => {
    const reqBody = request.body as CreateUserDto;
    const result = await fastify.domain.user.createUser({
      name: reqBody.name,
      surname: reqBody.surname,
      email: reqBody.email
    });

    return reply.status(201).send(result);
  });

  fastify.delete('/:id', async (request, reply) => {
    const id = (request?.params as unknown as { id?: string })?.id as string;

    if (!id) {
      return reply.status(400).send({ message: 'Id is required' });
    }

    await fastify.domain.user.deleteUser(id);

    return reply.status(200).send({ message: 'Title deleted' });
  });

  done();
};

// Posible way to improve code.

// export interface CreateUserDto {
//   name: string;
//   surname: string;
//   email: string;
// }

//   fastify.post<{ Body: CreateUserDto }>('/', async (request, reply) => {
//     const { name, surname, email } = request.body;

//     const result = await fastify.domain.user.createUser({
//       name,
//       surname,
//       email,
//     });

//     return reply.status(201).send(result);
//   });

//   done();
// };

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import type { CreateCVDto } from '../service';

type CreateCVParams = {
    userId: string;
};

export const apiV1CVRouter: FastifyPluginCallback = (fastify: FastifyInstance, _, done) => {
    fastify.post<{ Params: CreateCVParams; }>('/:userId', async (request, reply) => {
        const userId = request.params.userId;
        const userResults = await fastify.domain.user.findBy(userId);

        if (!userResults || !userResults?.length) {
            return reply.status(400).send({
                message: `User with ID: ${userId} not found`,
            });
        }

        const user = userResults[0];
        const reqBody = request.body as CreateCVDto;
        const result = await fastify.domain.cv.create(user, reqBody);

        return reply.status(201).send(result);
    });

    done();
};

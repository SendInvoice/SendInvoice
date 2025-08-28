const { validate: isValidUUID } = require('uuid');
import type { FastifyRequest, FastifyReply } from 'fastify';

function validateUUID(paramName: string = 'id') {
  return async function(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as Record<string, string>;
    const id = params[paramName];
    
    if (!id || !isValidUUID(id)) {
      return reply.status(400).send({ 
        message: `Invalid or missing ${paramName}` 
      });
    }
  };
}
const validateId = () => validateUUID('id');
const validateCompanyId = () => validateUUID('companyId');
const validateItemId = () => validateUUID('itemId');
const validateUserId = () => validateUUID('userId');

export { validateUUID, validateId, validateCompanyId, validateItemId, validateUserId };
export default validateUUID;
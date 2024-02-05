import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export function Healthcheck(
  server: FastifyInstance,
  opts: FastifyPluginOptions,
  done: () => void,
) {
  server.get('/healthcheck', {}, async function (request, reply) {
    return reply.code(200).send();
  });
  done();
}

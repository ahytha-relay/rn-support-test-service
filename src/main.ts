import Fastify from 'fastify';
// import DatabasePlugin from './plugins/database.js';
// import CustomerPlugin from './plugins/customer.js';

// import CustomerRouter from './routes/customer.js';
import { Healthcheck } from './routes/healthcheck';

const PORT = Number(process.env.SERVICE_PORT ?? 3000);

const server = Fastify({ logger: true });

const start = async () => {

  // await server.register(DatabasePlugin);
  // await server.register(CustomerPlugin);

  // await server.register(CustomerRouter);
  await server.register(Healthcheck);


  try {
    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
start();

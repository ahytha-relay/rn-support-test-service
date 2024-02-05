export default function Healthcheck(server, opts, done,) {

  server.get('/customer', {}, async function (request, reply) {
    const customer = await this.customerplugin.getAllCustomers(request.params.id);
    return reply.code(200).send(customer);
  });

  server.get('/customer/:id', {}, async function (request, reply) {
    const customer = await this.customerplugin.getCustomer(request.params.id);
    if( customer !== undefined ) {
      return reply.code(200).send(customer);
    } else {
      return reply.code(404).send();
    }
  });

  server.post('/customer', {}, async function (request, reply) {
    const data = await this.customerplugin.createCustomer(request.body);
    return reply.code(200).send(data);
  });

  server.put('/customer/:id', {}, async function (request, reply) {
    await this.customerplugin.updateCustomer(request.params.id, request.body);
    return reply.code(200).send();
  });

  server.delete('/customer/:id', {}, async function (request, reply) {
    await this.customerplugin.deleteCustomer(request.params.id);
    return reply.code(200).send();
  });

  done();

}

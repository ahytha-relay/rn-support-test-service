import fp from 'fastify-plugin';
import sqlite from 'sqlite3';
import { v4 as uuid } from 'uuid';

class CustomerPlugin {
  logger;
  db;
  constructor(options) {
    this.logger = options.logger;
    this.db = options.db;
  }

  async createCustomer(customerData) {
    this.logger.info(`Creating new customer with data: ${JSON.stringify(customerData)}`);
    return await this.db.run(`
      INSERT INTO
        customer
      VALUES (
        :id,
        :firstname,
        :lastname,
        :status
      )`, {
      ':id': uuid(),
      ':firstname': customerData.firstname,
      ':lastname': customerData.lastname,
      ':status': customerData.status,
    });
  }

  async getAllCustomers() {
    this.logger.info(`Getting all customer info`);
    return await this.db.query('SELECT * FROM customer', {});
  }

  async getCustomer(id) {
    this.logger.info(`Getting customer info for ${id}`);
    const result = await this.db.query('SELECT * FROM customer WHERE id = :id', { ':id': id });
    this.logger.info(`Found ${JSON.stringify(result[0])}`);
    return result[0];
  }

  async updateCustomer(id, customerData) {
    this.logger.info(`Updating customer ${id} with data: ${JSON.stringify(customerData)}`);
    return await this.db.run(`
      UPDATE
        customer
      SET
        firstname = :firstname,
        lastname = :lastname
        status = :status
      WHERE
        id = :id
      `, {
      ':id': id,
      ':firstname': customerData.firstname,
      ':lastname': customerData.lastname,
      ':status': customerData.status,
    });
  }

  async deleteCustomer(id) {
    this.logger.info(`Deleting customer info for ${id}`);
    this.db.run(`DELETE FROM customer WHERE id = :id`, {':id': id});
  }
}

export default fp( async (fastify) => {
    const plugin = new CustomerPlugin({
      logger: fastify.log,
      db: fastify.database
    });
    fastify.decorate('customerplugin', plugin);
  }, {
    fastify: '4.x',
    name: '@relaynetwork/customerplugin'
  });

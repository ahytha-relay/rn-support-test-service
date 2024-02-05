import path from 'node:path';
import fp from 'fastify-plugin';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_FILE = process.env.DB_FILE;

class DatabasePlugin {
  db_filename;
  logger;
  db;
  constructor(options) {
    this.logger = options.logger;
    this.db_filename = path.join(process.cwd(), process.env.DB_FILE);
    this.db = undefined;
  }

  static async initialize(options) {
    const instance = new DatabasePlugin(options);
    instance.logger.info('Connecting database plugin');
    instance.db = await open({
      filename: instance.db_filename,
      driver: sqlite3.Database
    });
    return instance;
  }

  async query(querystring, args) {
    this.logger.info(`Running query "${querystring}" with args "${JSON.stringify(args)}"`);
    const result = await this.db.all(querystring, args);
    this.logger.info(`Query returned ${result.length} result(s)`);
    return result;
  }

  async run(querystring, args) {
    this.logger.info(`Running database job "${querystring}" with args "${JSON.stringify(args)}"`);
    const result = await this.db.run(querystring, args);
    return result;
  }

  async close() {
    this.logger.info('Closing database connection');
    await this.db.close();
  }
}

export default fp( async (fastify) => {
    fastify.log.info(`Connecting to database`);
    const plugin = await DatabasePlugin.initialize({
      logger: fastify.log
    });

    fastify.decorate('database', plugin)

    fastify.addHook('onClose', async () => {
      await plugin.close();
    });
  }, {
    fastify: '4.x',
    name: '@relaynetwork/database'
  });


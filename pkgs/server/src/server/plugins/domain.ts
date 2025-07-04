import 'reflect-metadata';
import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { User, UserService } from '../../modules/user';

import { readConfig } from '../config';

export type DomainServices = {
  user: UserService;
};

export const DOMAIN_SERVICES_PLUGIN_NAME = 'domain';

export const domainServicesPlugin = fp(async (server) => {
  try {
    const config = readConfig();
    const appDataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDb,
      logging: true,
      synchronize: true,
      entities: [User]
    });

    await appDataSource.connect();
    appDataSource.runMigrations();

    const userRepository = appDataSource.getRepository(User);
    const domainServices: DomainServices = {
      user: new UserService(userRepository),
    };

    server.decorate(DOMAIN_SERVICES_PLUGIN_NAME, domainServices);
  } catch (error) {
    console.error(error);
  }
});

import 'reflect-metadata';
import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { Entity as CVEntity, CVService } from '../../modules/cv';
import { User, UserService } from '../../modules/user';

import { readConfig } from '../config';

export type DomainServices = {
  cv: CVService;
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
      entities: [User, CVEntity.CV, CVEntity.Contact, CVEntity.Education, CVEntity.Experience, CVEntity.SocialNetwork, CVEntity.Language, CVEntity.Personal]
    });

    await appDataSource.connect();
    appDataSource.runMigrations();

    const cvRepository = appDataSource.getRepository(CVEntity.CV);
    const contactRepository = appDataSource.getRepository(CVEntity.Contact);
    const userRepository = appDataSource.getRepository(User);
    const domainServices: DomainServices = {
      cv: new CVService(cvRepository, contactRepository),
      user: new UserService(userRepository),
    };

    server.decorate(DOMAIN_SERVICES_PLUGIN_NAME, domainServices);
  } catch (error) {
    console.error(error);
  }
});

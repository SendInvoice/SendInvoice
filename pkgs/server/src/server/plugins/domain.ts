import 'reflect-metadata';
import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { User, UserService } from '../../modules/user';

import { readConfig } from '../config';
import { Entity as CVEntity } from '../../modules/cv';
import { Education } from '../../modules/cv/entities/Education';
import { Experience } from '../../modules/cv/entities/Experience';
import { CV } from '../../modules/cv/entities/CV';
import { SocialNetwork } from '../../modules/cv/entities/SocialNetwork';
import { Language } from '../../modules/cv/entities/Language';
import { Personal } from '../../modules/cv/entities/Personal';

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
      entities: [User, CVEntity.CV, CVEntity.Contact, Education, Experience, SocialNetwork, Language, Personal]
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

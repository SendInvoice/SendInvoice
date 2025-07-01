import 'reflect-metadata';
import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { Title, TitleService } from '../../modules/title';
import { Image, ImageService } from '../../modules/images';
import { Name, NameService, NameProfession } from '../../modules/names';

import { readConfig } from '../config';

export type DomainServices = {
  images: ImageService;
  names: NameService;
  titles: TitleService;
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
      entities: [Image, Name, NameProfession, Title]
    });

    await appDataSource.connect();
    appDataSource.runMigrations();

    const imageRepository = appDataSource.getRepository(Image);
    const nameRepository = appDataSource.getRepository(Name);
    const nameProfessionRepository = appDataSource.getRepository(NameProfession);
    const titleRepository = appDataSource.getRepository(Title);
    const domainServices: DomainServices = {
      images: new ImageService(imageRepository),
      names: new NameService(nameRepository, nameProfessionRepository),
      titles: new TitleService(titleRepository),
    };

    server.decorate(DOMAIN_SERVICES_PLUGIN_NAME, domainServices);
  } catch (error) {
    console.error(error);
  }
});

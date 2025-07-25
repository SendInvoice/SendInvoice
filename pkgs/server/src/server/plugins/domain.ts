import 'reflect-metadata';
import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { readConfig } from '../config';
import { User, UserService } from '../../modules/user';
import { Entity as InvoiceEntity, InvoiceService } from '../../modules/invoice';
import { Token } from '../../modules/auth/entity';
import { AuthService } from '../../modules/auth';

export type DomainServices = {
  auth: AuthService;
  invoice: InvoiceService;
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
      entities: [
        User,
        InvoiceEntity.Address,
        InvoiceEntity.Company,
        InvoiceEntity.Invoice,
        InvoiceEntity.InvoiceItem,
        InvoiceEntity.Recipient,
        Token
      ]
    });

    await appDataSource.connect();
    appDataSource.runMigrations();

    const tokenRepository = appDataSource.getRepository(Token);
    const invoiceRepository = appDataSource.getRepository(InvoiceEntity.Invoice);
    const userRepository = appDataSource.getRepository(User);
    const userService = new UserService(userRepository);
    const domainServices: DomainServices = {
      auth: new AuthService(tokenRepository, userService),
      invoice: new InvoiceService(invoiceRepository),
      user: userService
    };

    server.decorate(DOMAIN_SERVICES_PLUGIN_NAME, domainServices);
  } catch (error) {
    console.error(error);
  }
});

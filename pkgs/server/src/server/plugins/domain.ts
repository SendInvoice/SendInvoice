import 'reflect-metadata';

import fp from 'fastify-plugin';
import { DataSource } from 'typeorm';

import { readConfig } from '../config';
import { User, UserService } from '../../modules/user';
import { Entity as InvoiceEntity, InvoiceService } from '../../modules/invoice';
import { Token } from '../../modules/auth/entity';
import { AuthService } from '../../modules/auth';
import { AddressService } from '../../modules/invoice/service/AddressService';
import { CompanyService } from '../../modules/invoice/service/CompanyService';
import { RecipientService } from '../../modules/invoice/service/RecipientService';

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

    // User Service
    const userRepository = appDataSource.getRepository(User);
    const userService = new UserService(userRepository);

    // Auth Service
    const tokenRepository = appDataSource.getRepository(Token);
    const authService = new AuthService(tokenRepository, userService);

    // Invoice Service
    const addressRepository = appDataSource.getRepository(InvoiceEntity.Address);
    const companyRepository = appDataSource.getRepository(InvoiceEntity.Company);
    const recipientRepository = appDataSource.getRepository(InvoiceEntity.Recipient);
    const invoiceRepository = appDataSource.getRepository(InvoiceEntity.Invoice);
    const invoiceItemRepository = appDataSource.getRepository(InvoiceEntity.InvoiceItem);

    const addressService = new AddressService(addressRepository);
    const companyService = new CompanyService(companyRepository);
    const recipientService = new RecipientService(recipientRepository);
    
    const invoiceService = new InvoiceService(invoiceRepository, invoiceItemRepository, addressService, companyService, recipientService);

    const domainServices: DomainServices = {
      auth: authService,
      invoice: invoiceService,
      user: userService
    };

    server.decorate(DOMAIN_SERVICES_PLUGIN_NAME, domainServices);
  } catch (error) {
    console.error(error);
  }
});

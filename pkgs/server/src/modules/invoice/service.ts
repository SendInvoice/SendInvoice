import { In, Repository } from 'typeorm';

import { Entity } from '..';
import type { User } from '../user';

export type CreateInvoiceDto = {
    title: string;
};

export class InvoiceService {
  private invoiceRepository: Repository<Entity.Invoice>;

  constructor(invoiceRepository: Repository<Entity.Invoice>) {
    this.invoiceRepository = invoiceRepository;
  }

  // async create(user: User, dto: CreateInvoiceDto): Promise<Entity.Invoice[]> {
  //   const entityInvoice = new Entity.Invoice();

  //   entityCv.title = dto.title;
  //   entityCv.user = user;

  //   const entityContact = new Entity.Contact();

  //   if (dto.contact) {
  //     const contactPayload = dto.contact;

  //     if (contactPayload.email) {
  //       entityContact.email = contactPayload.email;
  //     }
  //   }

  //   entityContact.user = user;

  //   await this.cvContactRepository.insert(entityContact);
  //   entityCv.contact = entityContact;
  //   const inserted = await this.cvRepository.insert(entityCv);

  //   return this.cvRepository.findBy({ id: In([inserted.identifiers[0].id]) });
  // }
}

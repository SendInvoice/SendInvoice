import { Repository } from 'typeorm';

import { Entity } from './';

export type CreateInvoiceDto = {
  title: string;
};

export class InvoiceService {
  private invoiceRepository: Repository<Entity.Invoice>;

  constructor(invoiceRepository: Repository<Entity.Invoice>) {
    this.invoiceRepository = invoiceRepository;
  }
}

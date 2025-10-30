import { AddressService } from './AddressService';
import { CompanyService } from './CompanyService';
import { RecipientService } from './RecipientService';

import type { Repository } from 'typeorm';
import { Invoice, InvoiceItem } from '../entities';
import { Entity } from '..';

export type CreateInvoiceDto = {
  id: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  total: number;
  date: Date;
  dueDate: Date;
  notes: string;
  billToAddressId: string;
  shipToAddressId: string;
  userId: string;
  companyId: string;
  recipientCompanyId: string;
  items: CreateInvoiceItemDto[];
};

export type CreateInvoiceItemDto = {
  amount: number;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type UpdateInvoiceItemDto = {
  amount?: number;
  description?: string;
  quantity?: number;
  unitPrice?: number;
};
export class InvoiceService {
  public readonly invoiceRepository: Repository<Entity.Invoice>;
  public readonly invoiceItemRepository: Repository<Entity.InvoiceItem>;
  public readonly address: AddressService;
  public readonly company: CompanyService;
  public readonly recipient: RecipientService;

  constructor(
    invoiceRepository: Repository<Invoice>,
    invoiceItemRepository: Repository<InvoiceItem>,
    address: AddressService,
    company: CompanyService,
    recipient: RecipientService
  ) {
    this.invoiceRepository = invoiceRepository;
    this.invoiceItemRepository = invoiceItemRepository;
    this.address = address;
    this.company = company;
    this.recipient = recipient;
  }

  async find(query: { companyId: string }): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find({
      where: {
        company: { id: query.companyId }
      },
      relations: ['billToAddress', 'shipToAddress', 'company', 'recipient', 'user', 'items'],
      order: { createdAt: 'DESC' }
    });

    return invoices;
  }

  async findById(id: string): Promise<Invoice | null> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['billToAddress', 'shipToAddress', 'company', 'recipient', 'user', 'items']
    });

    return invoice || null;
  }

  async findByUserId(userId: string): Promise<Invoice[]> {
    const invoice = await this.invoiceRepository.find({
      where: { user: { id: userId } },
      relations: ['billToAddress', 'shipToAddress', 'company', 'recipient', 'user', 'items'],
      order: { createdAt: 'DESC' }
    });
    return invoice;
  }

  async findByCompanyId(companyId: string): Promise<Invoice[]> {
    const invoice = await this.invoiceRepository.find({
      where: { user: { id: companyId } },
      relations: ['billToAddress', 'shipToAddress', 'company', 'recipient', 'user', 'items'],
      order: { createdAt: 'DESC' }
    });
    return invoice;
  }

  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const [billToAddress, shipToAddress, company, recipient] = await Promise.all([
      this.address.findById(dto.billToAddressId),
      this.address.findById(dto.shipToAddressId),
      this.company.findById(dto.companyId),
      this.recipient.findById(dto.recipientCompanyId)
    ]);

    if (!billToAddress) throw new Error('Bill to address not found');
    if (!shipToAddress) throw new Error('Ship to address not found');
    if (!company) throw new Error('Company not found');
    if (!recipient) throw new Error('Recipient not found');

    const date = new Date(dto.date as unknown as string);
    const dueDate = new Date(dto.dueDate as unknown as string);

    const invoiceData = {
      invoiceNumber: dto.invoiceNumber,
      subtotal: dto.subtotal,
      tax: dto.tax,
      total: dto.total,
      date,
      dueDate,
      notes: dto.notes,
      billToAddress: { id: dto.billToAddressId },
      shipToAddress: { id: dto.shipToAddressId },
      user: { id: dto.userId },
      company: { id: dto.companyId },
      recipientCompany: { id: dto.recipientCompanyId },
      items: dto.items.map((item) => ({
        amount: item.amount,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };

    const invoice = this.invoiceRepository.create(invoiceData);
    return await this.invoiceRepository.save(invoice);
  }

  async updateById(id: string, invoiceData: Partial<Invoice>): Promise<Invoice | null> {
    await this.invoiceRepository.update({ id }, invoiceData);
    return await this.findById(id);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.invoiceRepository.softDelete({ id });
    return result.affected !== 0;
  }

  //InvoiceItems

  async findInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const items = await this.invoiceItemRepository.find({
      where: { invoice: { id: invoiceId } },
      relations: ['invoice'],
      order: { createdAt: 'ASC' }
    });

    return items;
  }

  async findInvoiceItemById(invoiceId: string, itemId: string): Promise<InvoiceItem | null> {
    const item = await this.invoiceItemRepository.findOne({
      where: {
        id: itemId,
        invoice: { id: invoiceId }
      },
      relations: ['invoice']
    });

    return item || null;
  }

  async createInvoiceItem(invoiceId: string, dto: CreateInvoiceItemDto): Promise<InvoiceItem> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId }
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    const itemData = {
      amount: dto.amount,
      description: dto.description,
      quantity: dto.quantity,
      unitPrice: dto.unitPrice,
      invoice: { id: invoiceId }
    };

    const item = this.invoiceItemRepository.create(itemData);
    const savedItem = await this.invoiceItemRepository.save(item);

    await this.updateInvoiceTotals(invoiceId);

    return savedItem;
  }

  async updateInvoiceItemById(
    invoiceId: string,
    itemId: string,
    dto: UpdateInvoiceItemDto
  ): Promise<InvoiceItem | null> {
    const existingItem = await this.invoiceItemRepository.findOne({
      where: {
        id: itemId,
        invoice: { id: invoiceId }
      }
    });

    if (!existingItem) {
      return null;
    }

    const updatedData = { ...dto };
    if (dto.quantity !== undefined || dto.unitPrice !== undefined) {
      const quantity = dto.quantity ?? existingItem.quantity;
      const unitPrice = dto.unitPrice ?? existingItem.unitPrice;
      updatedData.amount = quantity * unitPrice;
    }

    await this.invoiceItemRepository.update({ id: itemId }, updatedData);
    await this.updateInvoiceTotals(invoiceId);

    return await this.invoiceItemRepository.findOne({
      where: { id: itemId },
      relations: ['invoice']
    });
  }

  async deleteInvoiceItemById(invoiceId: string, itemId: string): Promise<boolean> {
    const existingItem = await this.invoiceItemRepository.findOne({
      where: {
        id: itemId,
        invoice: { id: invoiceId }
      }
    });

    if (!existingItem) {
      return false;
    }

    const result = await this.invoiceItemRepository.softDelete({ id: itemId });

    if (result.affected !== 0) {
      await this.updateInvoiceTotals(invoiceId);
      return true;
    }

    return false;
  }

  private async updateInvoiceTotals(invoiceId: string): Promise<void> {
    const items = await this.invoiceItemRepository.find({
      where: { invoice: { id: invoiceId } }
    });

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId }
    });

    if (invoice) {
      const taxRate = invoice.subtotal > 0 ? invoice.tax / invoice.subtotal : 0;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      await this.invoiceRepository.update(
        { id: invoiceId },
        {
          subtotal: Math.round(subtotal * 100) / 100,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100
        }
      );
    }
  }
}

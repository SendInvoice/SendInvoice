import { Repository } from 'typeorm';

import { Entity } from '..';
import { Recipient } from '../entities';

export type CreateRecipientDto = {
  recipientName: string;
  phone: string;
  email: string;
  addressId: string;
};

export class RecipientService {
  private recipientRepository: Repository<Entity.Recipient>;

  constructor(RecipientRepository: Repository<Entity.Recipient>) {
    this.recipientRepository = RecipientRepository;
  }

  public async find(): Promise<Entity.Recipient[]> {
    return this.recipientRepository.find({
      relations: ['address', 'invoices']
    });
  }

  public async createRecipient(dto: CreateRecipientDto): Promise<Entity.Recipient> {

    if (!dto.recipientName?.trim()) {
      throw new Error('Recipient name is required');
    }
    if (!dto.phone?.trim()) {
      throw new Error('Phone is required');
    }

    if (!dto.email?.trim()) {
      throw new Error('Email is required');
    }

    if (!dto.addressId?.trim()) {
      throw new Error('Address ID is required');
    }

    const recipient = new Recipient();

    recipient.recipientName = dto.recipientName;
    recipient.phone = dto.phone;
    recipient.email = dto.email;
    recipient.address = { id: dto.addressId } as any;

    const result = await this.recipientRepository.save(recipient);

    return result;
  }

  public async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.recipientRepository.findOne({
      where: { id },
      relations: ['address', 'invoices']
    });

    return recipient || null;
  }

  public async updateById(id: string, data: Partial<Recipient>): Promise<Recipient | null> {
    await this.recipientRepository.update({ id }, data);
    const updated = await this.recipientRepository.findOneBy({ id });
    return updated || null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.recipientRepository.softDelete({ id });
    return result.affected !== 0;
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

import { Invoice } from './Invoice';

import type { Relation } from 'typeorm';

@Entity({
  name: 'invoice_item'
})
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  amount: number;

  @Column()
  description: string;

  @Column('int')
  quantity: number;

  @Column('float')
  unitPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Invoice, (invoice) => invoice.items)
  invoice: Relation<Invoice>;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn
} from 'typeorm';

import { Company } from './Company';
import { Recipient } from './Recipient';
import { Address } from './Address';
import { User } from '../../user';
import { InvoiceItem } from './InvoiceItem';

import type { Relation } from 'typeorm';

@Entity({
  name: 'invoice'
})
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  invoiceNumber: string;

  @Column('float')
  subtotal: number;

  @Column('float')
  tax: number;

  @Column('float')
  total: number;

  @Column()
  date: Date;

  @Column()
  dueDate: Date;

  @Column()
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Address, (address) => address.billedInvoices)
  billToAddress: Relation<Address>;

  @ManyToOne(() => Address, (address) => address.shippedInvoices)
  shipToAddress: Relation<Address>;

  @ManyToOne(() => User, (user) => user.invoices)
  user: Relation<User>;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: Relation<InvoiceItem[]>;

  @ManyToOne(() => Company, (company) => company.invoices)
  company: Relation<Company>;

  @ManyToOne(() => Recipient, (recipient) => recipient.invoices)
  recipient: Relation<Recipient>;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

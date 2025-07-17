import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Company } from './Company';
import { Recipient } from './Recipient';
import { Address } from './Address';
import { User } from '../../user';
import { InvoiceItem } from './InvoiceItem';

@Entity({ 
    name: 'invoice' 
})
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Company, (company) => company.invoices)
  company: Company;

  @ManyToOne(() => Recipient, (recipient) => recipient.invoices)
  recipientCompany: Recipient;

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
  billToAddress: Address;

  @ManyToOne(() => Address, (address) => address.shippedInvoices)
  shipToAddress: Address;

  @ManyToOne(() => User, (user) => user.invoices)
  user: User;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];
}

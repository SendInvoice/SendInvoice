import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  DeleteDateColumn
} from 'typeorm';

import { Company } from './Company';
import { Recipient } from './Recipient';
import { Invoice } from './Invoice';

import type { Relation } from 'typeorm';

@Entity({
  name: 'address'
})
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  streetAddress1: string;

  @Column()
  streetAddress2: string;

  @Column()
  city: string;

  @Column()
  cityArea: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Company, (company) => company.address)
  companies: Relation<Company[]>;

  @OneToMany(() => Recipient, (recipient) => recipient.address)
  recipients: Relation<Recipient[]>;

  @OneToMany(() => Invoice, (invoice) => invoice.billToAddress)
  billedInvoices: Relation<Invoice[]>;

  @OneToMany(() => Invoice, (invoice) => invoice.shipToAddress)
  shippedInvoices: Relation<Invoice[]>;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

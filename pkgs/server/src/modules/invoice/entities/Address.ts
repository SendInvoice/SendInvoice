import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany
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
  StreetAddress1: string;

  @Column()
  StreetAddress2: string;

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
}

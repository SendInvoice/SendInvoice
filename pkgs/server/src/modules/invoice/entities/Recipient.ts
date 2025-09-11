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

import { Address } from './Address';
import { Invoice } from './Invoice';

import type { Relation } from 'typeorm';

@Entity({
  name: 'recipient'
})
export class Recipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recipientName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Address, (address) => address.recipients)
  address: Relation<Address>;

  @OneToMany(() => Invoice, (invoice) => invoice.recipient)
  invoices: Relation<Invoice[]>;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

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

import { User } from '../../user';
import { Address } from './Address';
import { Invoice } from './Invoice';

import type { Relation } from 'typeorm';

@Entity({
  name: 'company'
})
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  logo: string;

  @Column()
  signature: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.companies)
  user: Relation<User>;

  @ManyToOne(() => Address, (address) => address.companies)
  address: Relation<Address>;

  @OneToMany(() => Invoice, (invoice) => invoice.company)
  invoices: Relation<Invoice[]>;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

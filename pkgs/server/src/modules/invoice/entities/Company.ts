import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { User } from '../../user';
import { Address } from './Address';
import { Image } from '../../image';
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

  @OneToOne(() => Image, { nullable: true })
  @JoinColumn()
  logo?: Relation<Image>;

  @OneToOne(() => Image, { nullable: true })
  @JoinColumn()
  signature?: Relation<Image>;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}

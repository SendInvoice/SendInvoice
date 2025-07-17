import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user';

import { Address } from './Address';
import { Invoice } from './Invoice';

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
  user: User;

  @ManyToOne(() => Address, (address) => address.companies)
  address: Address;

  @OneToMany(() => Invoice, (invoice) => invoice.company)
  invoices: Invoice[];
}

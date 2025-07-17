import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Invoice } from '../invoice/entities/Invoice';
import { Company } from '../invoice/entities/Company';


@Entity({ 
  name: 'user' 
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Company, (company) => company.user)
  companies: Company[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];
}

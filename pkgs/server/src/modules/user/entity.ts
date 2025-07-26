import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  type Relation
} from 'typeorm';
import { Invoice } from '../invoice/entities/Invoice';
import { Company } from '../invoice/entities/Company';
import { Token } from '../auth/entity';

@Entity({
  name: 'user'
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  surname: string;

  @Column({ unique:true, nullable: false})
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Company, (company) => company.user)
  companies: Relation<Company[]>;

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Relation<Invoice>;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Relation<Token[]>;
}

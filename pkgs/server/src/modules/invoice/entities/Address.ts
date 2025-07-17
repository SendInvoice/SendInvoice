import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    type Relation,
    OneToOne,
    OneToMany
} from 'typeorm';
import { Company } from './Company';
import { Recipient } from './Recipient';
import { Invoice } from './Invoice';

@Entity({
    name: 'address',
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
    companies: Company[];

    @OneToMany(() => Recipient, (recipient) => recipient.address)
    recipients: Recipient[];

    @OneToMany(() => Invoice, (invoice) => invoice.billToAddress)
    billedInvoices: Invoice[];

    @OneToMany(() => Invoice, (invoice) => invoice.shipToAddress)
    shippedInvoices: Invoice[];
}

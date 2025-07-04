import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    type Relation,
    OneToOne
} from 'typeorm';
import { User } from '../../user';

@Entity({
    name: 'cv_contact',
})
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    website: string;
    
    @Column()
    location: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne (() => User, (user) => user.id)
    user: Relation<User>;
}

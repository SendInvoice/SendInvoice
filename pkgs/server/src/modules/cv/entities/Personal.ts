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
    name: 'cv_personal',
})
export class Personal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    jobTitle: string;

    @Column()
    summary: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne (() => User, (user) => user.id)
    user: Relation<User>;
}

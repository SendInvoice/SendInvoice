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
    name: 'cv_socialnetwork',
})
export class SocialNetwork {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    linkedIn: string;

    @Column()
    twitter: string;

    @Column()
    github: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne (() => User, (user) => user.id)
    user: Relation<User>;
}

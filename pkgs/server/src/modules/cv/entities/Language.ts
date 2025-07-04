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
import { CV } from './CV';

@Entity({
    name: 'cv_language',
})
export class Language {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    language: string;

    @Column()
    level: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne (() => User, (user) => user.id)
    user: Relation<User>;

    @ManyToOne(() => CV, (cv) => cv.language)
    cv: Relation<CV>;
}

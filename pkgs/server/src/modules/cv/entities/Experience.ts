import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    type Relation,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { User } from '../../user';
import { CV } from './CV';

@Entity({
    name: 'cv_experience',
})
export class Experience {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    organizationName: string;

    @Column()
    description: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    user: Relation<User>;

    @ManyToOne(() => CV, (cv) => cv.experience)
    cv: Relation<CV>;
}

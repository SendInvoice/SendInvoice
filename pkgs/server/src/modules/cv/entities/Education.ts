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
    name: 'cv_education',
})
export class Education {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    institutionName: string;

    //Name might change. Option one: degreeTitle
    @Column()
    title: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne (() => User, (user) => user.id)
    user: Relation<User>;

    @ManyToOne(() => CV, (cv) => cv.education)
    cv: Relation<CV>;
}

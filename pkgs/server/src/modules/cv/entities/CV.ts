import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    type Relation,
    ManyToOne,
    OneToOne,
    OneToMany
} from 'typeorm';
import { User } from '../../user';

import { Personal } from './Personal';
import { Contact } from './Contact';
import { SocialNetwork } from './SocialNetwork';
import { Language } from './Language';
import { Education } from './Education';
import { Experience } from './Experience';

@Entity({
    name: 'cv',
})
export class CV {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    //   @ManyToOne(() => LatexTemplate, (template) => template.id)
    //   template: Relation<LatexTemplate>;

    @ManyToOne(() => User, (user) => user.id)
    user: Relation<User>;

    @OneToOne(() => Personal)
    personal: Relation<Personal>;

    @OneToOne(() => Contact)
    contact: Relation<Contact>;

    @OneToOne(() => SocialNetwork)
    socialNetwork: Relation<SocialNetwork>;

    @OneToMany(() => Language, (language) => language.cv)
    language: Relation<Language[]>;

    @OneToMany(() => Education, (education) => education.cv)
    education: Relation<Education[]>;

    @OneToMany(() => Experience, (experience) => experience.cv)
    experience: Relation<Experience[]>;
}

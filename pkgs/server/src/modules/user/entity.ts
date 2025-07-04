import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  type Relation,

} from 'typeorm';

import { CV } from '../cv/entities/CV';
import { Contact } from '../cv/entities/Contact';
import { Personal } from '../cv/entities/Personal';
import { SocialNetwork } from '../cv/entities/SocialNetwork';
import { Experience } from '../cv/entities/Experience';
import { Education } from '../cv/entities/Education';
import { Language} from '../cv/entities/Language';

@Entity({ name: 'users' })

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
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => CV, (cv) => cv.user)
  cv: Relation<CV[]>;

  @OneToMany(() => Contact, (contact) => contact.user)
  contact: Relation<Contact[]>;

  @OneToMany(() => Personal, (personal) => personal.user)
  personal: Relation<Personal[]>;

  @OneToMany(() => SocialNetwork, (social) => social.user)
  socialNetwork: Relation<SocialNetwork[]>;

  @OneToMany(() => Experience, (experience) => experience.user)
  experience: Relation<Experience[]>;

  @OneToMany(() => Education, (education) => education.user)
  education: Relation<Education[]>;

  @OneToMany(() => Language, (language) => language.user)
  language: Relation<Language[]>;
}

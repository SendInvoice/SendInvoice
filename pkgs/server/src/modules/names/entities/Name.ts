import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';

import { NameProfession } from './NameProfession';
import { Title } from '../../title';

@Entity({
  name: 'names'
})
export class Name {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('date')
  birthDate: Date;

  @Column('date', { nullable: true })
  deathDate?: Date;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @OneToMany(() => NameProfession, (nameProfession) => nameProfession.name)
  professions: NameProfession[]

  @ManyToMany(() => Title)
  @JoinTable()
  titles: Title[]
}

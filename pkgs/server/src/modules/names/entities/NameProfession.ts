import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation
} from 'typeorm';

import { Name } from './Name';

export enum Profession {
    Actor = 'ACTOR',
    Actress = 'ACTRESS',
    Producer = 'PRODUCER',
    Director = 'DIRECTOR',
    Miscellaneous = 'MISCELLANEOUS'
  }

@Entity({
  name: 'name_profession',
})
export class NameProfession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Profession,
  })
  profession: Profession;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  @ManyToOne(() => Name, (name) => name.professions)
  name: Relation<Name>;
}

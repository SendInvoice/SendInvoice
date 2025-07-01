import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MimeType {
  Jpg = 'image/jpeg',
  Png = 'image/png'
}

/**
 * A generic image resource
 */
@Entity({
  name: 'images'
})
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int2')
  height: number;

  @Column('int2')
  width: number;

  @Column({
    type: 'enum',
    enum: MimeType,
  })
  mimeType: MimeType;

  @Column('int4')
  size: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}

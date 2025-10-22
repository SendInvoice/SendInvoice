import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export enum ImagePurpose {
  CompanyLogo = 'company_logo',
  CompanySignature = 'company_signature',
  UserAvatar = 'user_avatar'
}

@Entity({
  name: 'image'
})
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bytea' })
  bytes: Buffer;

  @Column()
  mimeType: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ type: 'enum', enum: ImagePurpose })
  purpose: ImagePurpose;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

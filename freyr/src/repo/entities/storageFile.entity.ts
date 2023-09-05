import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class StorageFile extends BaseEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  bucket: string;

  @Column()
  eTab: string;

  @Column()
  public_url: string;

  @Column({ nullable: true })
  name: string;
}

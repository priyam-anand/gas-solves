import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  refreshTokenHash?: string;
}

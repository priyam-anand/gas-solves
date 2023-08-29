import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  address: string;

  @Column()
  refreshTokenHash?: string;
}

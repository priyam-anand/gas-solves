import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 42 })
  address: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profile_picture?: string;

  @Column({ nullable: true })
  refreshTokenHash?: string;

  @OneToMany(() => Submission, (submission) => submission.user)
  submissions: Submission[];
}

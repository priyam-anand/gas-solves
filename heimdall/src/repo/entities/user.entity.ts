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

  @Column()
  name?: string;

  @Column()
  profile_picture?: string;

  @Column()
  refreshTokenHash?: string;

  @OneToMany(() => Submission, (submission) => submission.id)
  submissions: Submission[];
}

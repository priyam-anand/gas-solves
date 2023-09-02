import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submission } from './submission.entity';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  problem_statement: string;

  @Column()
  boilerplace_code: string;

  @Column()
  pointes: number;

  @OneToMany(() => Submission, (submission) => submission.id)
  submissions: Submission[];
}

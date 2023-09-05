import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { User } from './user.entity';

enum Verdict {
  PROCESSING,
  SUCCESS,
  FAILED,
}

@Entity()
export class Submission extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  verdict: Verdict;

  @Column()
  gas_used?: number;

  @Column()
  code_file: string;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => User)
  user: User;
}

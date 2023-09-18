import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { User } from './user.entity';

export enum Verdict {
  PROCESSING,
  SUCCESS,
  FAILED,
  INVALID,
}

@Entity()
export class Submission extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ default: Verdict.PROCESSING })
  verdict: Verdict;

  @Column({ nullable: true })
  gas_used: number;

  @Column()
  code_file: string;

  @ManyToOne(() => Question, (question) => question.submissions)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

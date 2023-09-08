import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Submission } from './submission.entity';
import { Contest } from './contest.entity';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  problem_statement: string;

  @Column({ nullable: true })
  boilerplate_code: string;

  @Column()
  pointes: number;

  @ManyToOne(() => Contest, (contest) => contest.questions)
  @JoinColumn({ name: 'contest_id' })
  contest: Contest;

  @OneToMany(() => Submission, (submission) => submission.question)
  submissions: Submission[];
}

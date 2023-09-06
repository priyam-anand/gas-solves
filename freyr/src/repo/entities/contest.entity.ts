import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';
import { Type } from 'class-transformer';

@Entity()
export class Contest extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @OneToMany(() => Question, (question) => question.contest, { cascade: true })
  questions: Question[];
}

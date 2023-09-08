import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from './question.entity';

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

  @OneToMany(() => Question, (question) => question.contest, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  questions: Question[];
}

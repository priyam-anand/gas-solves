import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Contest extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => Question, (question) => question.id, { cascade: true })
  questions: Question[];
}

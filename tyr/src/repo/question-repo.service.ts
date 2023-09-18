import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectEntityManager } from '@nestjs/typeorm';
import { GenericError } from 'src/common/errors/generic.error';

@Injectable()
export class QuestionRepoService {
  private questionRepo: Repository<Question>;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {
    this.questionRepo = entityManager.getRepository(Question);
  }

  async getQuestion(options: FindOneOptions<Question>) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Finding question record [condition : ${JSON.stringify(options)}]`,
        );
        const result = await this.questionRepo.findOne(options);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in finding question record [condition : ${JSON.stringify(
            options,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not fetch record from DB',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }
}

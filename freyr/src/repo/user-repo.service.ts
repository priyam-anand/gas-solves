import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GenericError } from 'src/common/errors/generic.error';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserRepoService {
  private userRepo: Repository<User>;

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.userRepo = this.entityManager.getRepository(User);
  }

  async getUser(options: FindOneOptions<User>) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Fetching user record [options : ${JSON.stringify(options)}]`,
        );
        const result = await this.userRepo.findOne(options);
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in fetching user record [options : ${JSON.stringify(
            options,
          )}]`,
        );
        reject(
          new GenericError(
            'Could not fetch user record',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }

  async updateUser(
    address: string,
    partialEntity: QueryDeepPartialEntity<User>,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Updating user : [address : ${address}, user data : ${JSON.stringify(
            partialEntity,
          )}]`,
        );
        const result = await this.userRepo.update(
          { address: address },
          partialEntity,
        );
        resolve(result);
      } catch (error) {
        this.logger.error(
          `Error in updating user : [address : ${address}, user data : ${JSON.stringify(
            partialEntity,
          )}] : ${error.stack}`,
        );
        reject(
          new GenericError(
            'Could not update user',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    });
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { User } from 'src/auth/entities/user.entity';
import { DbException } from 'src/db/errors/db.error';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Logger, add } from 'winston';

@Injectable()
export class UserRepoService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(address: string): Promise<User> {
    try {
      this.logger.info(`Creating new user [address : ${address}]`);

      const nweUser = new User();
      nweUser.address = address;

      const createdAccount = await this.userRepo.save(nweUser);
      return createdAccount;
    } catch (error) {
      this.logger.error(
        `Error in create account [address : ${address}] : ${error}`,
      );
      throw new DbException(`DB Exception when creating: ${error}`);
    }
  }

  async findOrCreate(address: string): Promise<User> {
    try {
      this.logger.info(`Searching for user [address : ${address}]`);

      let user = await this.userRepo.findOne({ where: { address: address } });

      if (!user) {
        this.logger.info(`Account not found [address : ${address}]`);

        user = (await this.create(address)) as User;
      }

      return user;
    } catch (error) {
      this.logger.error(
        `Error in finding or creating account [address : ${address}] : ${error}`,
      );
      throw new DbException(`DB Exception when finding user : ${error}`);
    }
  }

  async updateUser(
    address: string,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<void> {
    try {
      this.logger.info(
        `Updating account [address : ${address}, update : ${JSON.stringify(
          partialEntity,
        )}]`,
      );
      await this.userRepo.update({ address }, partialEntity);
    } catch (error) {
      this.logger.error(`Error in updating account [address : ${address}]`);
      throw new DbException(`DB Exception when updating user: ${error}`);
    }
  }
}

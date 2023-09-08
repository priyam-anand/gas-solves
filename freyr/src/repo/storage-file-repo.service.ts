import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { StorageFile } from './entities/storageFile.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class StorageFileRepoService {
  private storageFileRepo: Repository<StorageFile>;

  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.storageFileRepo = entityManager.getRepository(StorageFile);
  }

  async create(
    key: string,
    bucket: string,
    eTab: string,
    public_url: string,
    name: string,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Creating S3 file record [key : ${key}, url : ${public_url}]`,
        );
        const storageFile = this.storageFileRepo.create({
          key,
          bucket,
          eTab,
          public_url,
          name,
        });

        const createdFile = await this.storageFileRepo.save(storageFile);
        resolve(createdFile);
      } catch (error) {
        this.logger.error(
          `Error in creating S3 file record [key : ${key}, url : ${public_url}]`,
        );
        reject(error);
      }
    });
  }

  async getPublicUrl(key: string) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(`Getting public url : [key : ${key}]`);
        const file = await this.storageFileRepo.findOne({
          where: { key: key },
        });
        if (file) {
          resolve(file.public_url);
        } else {
          resolve(null);
        }
      } catch (error) {
        this.logger.error(`Error in getting public url : [key : ${key}]`);
        reject(error);
      }
    });
  }
}

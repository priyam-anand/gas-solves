import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, config } from 'aws-sdk';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { StorageFile } from 'src/repo/entities/storageFile.entity';
import { StorageFileRepoService } from 'src/repo/storage-file-repo.service';
import { Logger } from 'winston';

@Injectable()
export class StorageFileSerivce implements OnApplicationBootstrap {
  private bucket: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly storageFileRepoService: StorageFileRepoService,
  ) {}

  async onApplicationBootstrap() {
    config.update({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.configService.get('S3_BUCKET_NAME');
  }

  async updload(
    key: string,
    fileData: Buffer,
    fileName: string = '',
    contentType: any = undefined,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Uploading file to S3 from buffer : [bucket : ${this.bucket}, key : ${key}]`,
        );

        const s3 = new S3();
        const result = await s3
          .upload({
            Bucket: this.bucket,
            Key: key,
            Body: fileData,
            ContentType: contentType,
          })
          .promise();

        const createdFile = <StorageFile>(
          await this.storageFileRepoService.create(
            result.Key,
            this.bucket,
            result.ETag,
            result.Location,
            fileName,
          )
        );
        resolve(createdFile);
      } catch (error) {
        this.logger.error(
          `Error in uploading file to S3 from buffer [bucket: ${this.bucket}, key: ${key}]`,
        );
        reject(error);
      }
    });
  }

  async delete(key: string) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Deleting file from S3 [bucket : ${this.bucket}, key: ${key}]`,
        );

        const s3 = new S3();
        await s3.deleteObject({ Bucket: this.bucket, Key: key }).promise();
        resolve(true);
      } catch (error) {
        this.logger.error(
          `Error in deleting file from S3 [bucket : ${this.bucket}, key: ${key}]`,
        );
        reject(error);
      }
    });
  }

  async get(key: string) {
    return new Promise(async (resolve, reject) => {
      try {
        this.logger.info(
          `Getting file from S3 [bucket : ${this.bucket}, key: ${key}]`,
        );

        const s3 = new S3();
        const file = await s3
          .getObject({ Bucket: this.bucket, Key: key })
          .promise();

        resolve(file);
      } catch (error) {
        this.logger.error(
          `Error in deleting file from S3 [bucket : ${this.bucket}, key: ${key}]`,
        );
        reject(error);
      }
    });
  }

  async getPublicUrl(key: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.storageFileRepoService.getPublicUrl(key);
        resolve(result);
      } catch (error) {
        this.logger.error(`Error in getting public URI [key: ${key}]`);
        reject(error);
      }
    });
  }
}

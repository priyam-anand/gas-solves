import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { isAddress } from 'ethers';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GenericError } from 'src/common/errors/generic.error';
import { User } from 'src/repo/entities/user.entity';
import { UserRepoService } from 'src/repo/user-repo.service';
import { Logger } from 'winston';
import { UpdateUserDto } from './dto/updateUser.dto';
import { StorageFileSerivce } from 'src/storageFile/storageFile.service';
import { createImageKey } from 'src/common/utils/keys';
import { StorageFile } from 'src/repo/entities/storageFile.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private userRepoService: UserRepoService,
    private storageFileService: StorageFileSerivce,
  ) {}

  async getUser(userAddress: string) {
    try {
      const { user } = <{ user: User; address: string }>(
        await this.validatUser(userAddress)
      );

      return user;
    } catch (error) {
      this.logger.error(
        `Error in fetching user [address : ${userAddress}] : ${error.stack}`,
      );
      throw new HttpException(
        { error: 'Error in fetching user', reason: error.message },
        error.status,
      );
    }
  }

  async updateProfile(userAddress: string, body: UpdateUserDto, file?: Buffer) {
    try {
      // validate incomming address
      const { user, address } = <{ user: User; address: string }>(
        await this.validatUser(userAddress)
      );

      if (body.name) user.name = body.name;
      if (file) {
        const storageFile = <StorageFile>(
          await this.storageFileService.updload(
            createImageKey({ time: Date.now() }),
            file,
          )
        );
        user.profile_picture = storageFile.public_url;
      }
      const result = await this.userRepoService.updateUser(address, user);
      return result;
    } catch (error) {
      this.logger.error(
        `Error in updating user [address : ${userAddress}, user : ${JSON.stringify(
          body,
        )}, file : ${file ? true : false}] : ${error.stack}`,
      );
      throw new HttpException(
        { error: 'Error in updating user', reason: error.message },
        error.status,
      );
    }
  }

  async validatUser(address: string) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!isAddress(address)) {
          throw new GenericError(
            'Invalid ethereum address passed',
            HttpStatus.BAD_REQUEST,
          );
        }
        address = address.toLowerCase();
        const user = <User>await this.userRepoService.getUser({
          where: { address: address },
        });

        if (!user) {
          throw new GenericError('User does not exist', HttpStatus.NOT_FOUND);
        }
        resolve({ user, address });
      } catch (error) {
        reject(error);
      }
    });
  }
}

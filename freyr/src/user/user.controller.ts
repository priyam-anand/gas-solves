import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':address')
  async getUser(@Param('address') address: string) {
    return this.userService.getUser(address);
  }

  @Post(':address')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Param('address') address: string,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfile(address, body, file?.buffer);
  }
}

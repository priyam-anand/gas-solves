import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessJwtAuthGuard } from 'src/common/guards/access-jwt-auth.guard';
import { UserAddress } from 'src/common/decorators/user-address.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':address')
  async getUser(@Param('address') address: string) {
    return this.userService.getUser(address);
  }

  @UseGuards(AccessJwtAuthGuard)
  @Post('/update')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @UserAddress() address: string,
  ) {
    return this.userService.updateProfile(address, body, file?.buffer);
  }
}

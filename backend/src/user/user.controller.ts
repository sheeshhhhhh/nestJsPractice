import {
  Body,
  Controller,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { changePasswordDto } from './dto/ChangePasswordDto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { changeUserInfoDto } from './dto/ChangeUserInfo';
import diskMulterStorage from 'src/util/discMulterStorage';
import { SetLocationDto } from './dto/SetLocation.dto';

@UseGuards(JwtAuthGuard) // This applies JWT authentication to all routes in this controller
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('change-Password')
  async changePassword(@Body() body: changePasswordDto, @Request() req: any) {
    return this.userService.changePassword(body, req);
  }

  @Post('change-Avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskMulterStorage('uploads/Avatar'),
    }),
  )
  async changeAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.changeAvatar(req, file);
  }

  @Post('change-Username')
  async changeUsername(
    @Request() req: any,
    @Body() body: { username: string },
  ) {
    // don't forget to handle the unique
    return this.userService.changeUsername(req, body.username);
  }

  @Post('change-userInfo')
  async changeUserInfo(@Request() req: any, @Body() body: changeUserInfoDto) {
    return this.userService.changeUserInfo(req, body);
  }

  @Post('change-address')
  async changeAddress(@Request() req: any, @Body() body: { address : string }) {
    return this.userService.changeAddress(req, body.address)
  }

  @Post('setLocation')
  async setLocation(@Body() body: SetLocationDto, @Request() req: any) {
    return this.userService.setLocation(body, req)
  }  
}

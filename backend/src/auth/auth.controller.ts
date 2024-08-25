import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UserCreate } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signUp')
  async createUser(@Body() UserCreate: UserCreate) {
    return this.authService.createUser(UserCreate);
  }

  // implement settings later

  @UseGuards(JwtAuthGuard) // this is use for checking the user a lot of times
  @Get('check')
  async check(@Request() req) {
    return this.authService.check(req);
  }

  // i can't find a source on how to logout in jwt so for now just do it in the client
  // we are doing the logout in the client side this is just a reminder
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Request() req: any, @Response() res: any) {
    return;
  }
}

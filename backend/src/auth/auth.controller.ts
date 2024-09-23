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
import { OwnerCreateDto, UserCreateDto } from './dto';
import { GoogleOAuthGuard } from './googleAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google-login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req: any) {}

  // google login
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req: any, @Response() res: any) {   
    const token = await this.authService.validateGoogle(req.user)
    return res.redirect(`http://localhost:5173/google-auth?token=${token.access_token}`)
  }

  // credentials login
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signUp')
  async createUser(@Body() UserCreate: UserCreateDto) {
    return this.authService.createUser(UserCreate);
  }

  // @Post('signUpRestaurantOwner') // for restaurant owner this is created
  // async createRestaurantOwner(@Body() OwnerCreate: OwnerCreateDto) {
  //   return this.authService.createRestaurantOwner(OwnerCreate)
  // }
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

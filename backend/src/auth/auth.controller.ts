import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { changePassword, UserCreate } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }

    @Post('signUp')
    async createUser(@Body() UserCreate: UserCreate) {
        return this.authService.createUser(UserCreate)
    }

    @UseGuards(JwtAuthGuard)
    @Post('changePassword')
    async changePassword(@Request() req ,@Body() Password: changePassword) {
        return this.authService.changePassword(req, Password)
    }

    @UseGuards(JwtAuthGuard) // this is use for checking the user a lot of times
    @Get('check')
    async check(@Request() req) {
        return this.authService.check(req)
    }


    // i can't find a source on how to logout in jwt so for now just do it in the client
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async logout(@Request() req) {
       return 
    }
}

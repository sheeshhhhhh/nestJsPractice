import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.jwtSecret!,
      signOptions: { expiresIn: '10h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

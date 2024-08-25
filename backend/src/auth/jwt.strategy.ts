import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
const jwtSecret = process.env.jwtSecret!;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // making sure it's unauthorized when the expiration expired
      secretOrKey: jwtSecret,
    });
  }

  // automatically calls this by passport strategy
  async validate(payload: any) {
    return payload;
  }
}

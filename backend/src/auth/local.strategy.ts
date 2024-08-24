import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    // automatically calls this by passport strategy
    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser({ username, password });
        if(!user.user) {
            throw new UnauthorizedException(user.message);
        }
        return user.user;
    }
}
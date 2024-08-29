import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_SECRET,
            callbackURL: process.env.OAUTH__CALLBACKURL,
            scope: ['email', 'profile'],
        })
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const { name, email, photos } = profile;
        // check if the user exist in the data base 
        // if not then register and login
        // if yes then just login
        done(null, profile)
    }
}
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any, done: VerifiedCallback) {

        const user = await this.authService.validateUser(payload);

        if (!user) {
            return done(
                new HttpException(
                    'Acesso não autorizado',
                    HttpStatus.UNAUTHORIZED,
                ),
                false,
            );
        }

        return done(null, user, payload.iat);

    }

}

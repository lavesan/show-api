import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {

    constructor(private authService: AdminAuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ADMIN_SECRET_KEY,
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

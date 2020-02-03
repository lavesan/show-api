import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '../../controllers/client/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';

@Module({
    controllers: [AuthController],
    imports: [
        UserModule,
        PassportModule,
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
})
export class AuthModule {}

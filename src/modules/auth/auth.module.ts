import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '../../controllers/client/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { AdminAuthService } from 'src/services/admin-auth/admin-auth.service';
import { UserBackofficeModule } from '../user-backoffice/user-backoffice.module';
import { JwtAdminStrategy } from 'src/services/admin-auth/jwt-admin.strategy';

@Module({
    controllers: [AuthController],
    imports: [
        UserModule,
        UserBackofficeModule,
        PassportModule,
    ],
    providers: [
        AuthService,
        AdminAuthService,
        JwtStrategy,
        JwtAdminStrategy,
    ],
})
export class AuthModule {}

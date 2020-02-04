import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '../../controllers/all/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from 'src/services/auth/jwt.strategy';
import { UserBackofficeModule } from '../user-backoffice/user-backoffice.module';
import { AdminAuthService } from 'src/services/admin-auth/admin-auth.service';
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
        JwtStrategy,
        AdminAuthService,
        JwtAdminStrategy,
    ],
})
export class AuthModule {}

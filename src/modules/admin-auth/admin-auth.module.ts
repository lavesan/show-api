import { Module } from '@nestjs/common';
import { AdminAuthController } from 'src/controllers/admin-auth/admin-auth.controller';
import { UserBackofficeModule } from '../user-backoffice/user-backoffice.module';
import { PassportModule } from '@nestjs/passport';
import { AdminAuthService } from 'src/services/admin-auth/admin-auth.service';
import { JwtAdminStrategy } from 'src/services/admin-auth/jwt-admin.strategy';

@Module({
    controllers: [AdminAuthController],
    imports: [
        UserBackofficeModule,
        PassportModule,
    ],
    providers: [
        AdminAuthService,
        JwtAdminStrategy,
    ],
})
export class AdminAuthModule {}

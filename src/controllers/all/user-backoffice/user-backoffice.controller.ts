import { Controller, Put, Body } from '@nestjs/common';
import { ResetPasswordUserBackofficeForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeForm';
import { UserBackofficeService } from 'src/services/user-backoffice/user-backoffice.service';

@Controller('user-backoffice')
export class UserBackofficeAllController {

    constructor(private readonly userBackofficeService: UserBackofficeService) {}

    @Put('reset-password')
    resetPassword(@Body() resetPasswordForm: ResetPasswordUserBackofficeForm) {
        return this.userBackofficeService.resetPassword(resetPasswordForm);
    }

}

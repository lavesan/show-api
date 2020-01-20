import { Controller, Get, Query, Body, Post, Put, Delete, Param } from '@nestjs/common';
import { UserBackofficeService } from 'src/services/user-backoffice/user-backoffice.service';
import { FilterForm } from 'src/model/forms/FilterForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';
import { UpdateUserBackofficeForm } from 'src/model/forms/user-backoffice/UpdateUserBackofficeForm';
import { ResetPasswordUserBackofficeForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeForm';
import { ResetPasswordUserBackofficeMailForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeMailForm';

@Controller('user-backoffice')
export class UserBackofficeController {

    constructor(private readonly userBackofficeService: UserBackofficeService) {}

    @Post()
    saveOne(@Body() userBackoffice: SaveUserBackofficeForm) {
        return this.userBackofficeService.save(userBackoffice);
    }

    @Put()
    updateOne(@Body() userBackoffice: UpdateUserBackofficeForm) {
        return this.userBackofficeService.update(userBackoffice);
    }

    @Put('reset-password')
    resetPassword(@Body() resetPasswordForm: ResetPasswordUserBackofficeForm) {
        return this.userBackofficeService.resetPassword(resetPasswordForm);
    }

    @Post('reset-password-mail')
    resetPasswordMail(@Body() resetPasswordMail: ResetPasswordUserBackofficeMailForm) {
        return this.userBackofficeService;
    }

    @Delete('id')
    deleteOne(@Param('id') userId: number) {
        return this.userBackofficeService.delete(userId);
    }

    @Get()
    findOneById(@Query('id') userId: number) {
        return this.userBackofficeService.findOneById(userId);
    }

    @Get('all')
    findAllFilteredPaginated(@Query() paginationForm: PaginationForm, @Body() filterForm: FilterForm[]) {
        this.userBackofficeService.findAllFilteredPaginated(paginationForm, filterForm);
    }

}

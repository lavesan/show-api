import { Controller, Get, Query, Body, Post, Put, Delete, Param, Headers } from '@nestjs/common';
import { UserBackofficeService } from 'src/services/user-backoffice/user-backoffice.service';
import { FilterForm } from 'src/model/forms/FilterForm';
import { PaginationForm } from 'src/model/forms/PaginationForm';
import { SaveUserBackofficeForm } from 'src/model/forms/user-backoffice/SaveUserBackofficeForm';
import { UpdateUserBackofficeForm } from 'src/model/forms/user-backoffice/UpdateUserBackofficeForm';
import { ResetPasswordUserBackofficeMailForm } from 'src/model/forms/user-backoffice/ResetPasswordUserBackofficeMailForm';
import { ActivationUserBackofficeForm } from 'src/model/forms/user-backoffice/ActivationUserBackofficeForm';
import { UpdateLoggedUserForm } from 'src/model/forms/user-backoffice/UpateLoggedUserForm';

@Controller('backoffice/user-backoffice')
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

    @Delete('id')
    deleteOne(@Param('id') userId: number) {
        return this.userBackofficeService.delete(userId);
    }

    @Get()
    findOneById(@Query('id') userId: number) {
        return this.userBackofficeService.findOneById(userId);
    }

    @Post('all')
    findAllFilteredPaginated(
        @Query() paginationForm: PaginationForm,
        @Body() filterForm: FilterForm[],
        @Headers('authorization') token: string,
    ) {
        return this.userBackofficeService.findAllFilteredPaginated(paginationForm, filterForm, token);
    }

    @Put('activate')
    manageActivation(@Body() body: ActivationUserBackofficeForm) {
        return this.userBackofficeService.manageActivation(body);
    }

    @Put('logged')
    updateLoggedUser(@Body() body: UpdateLoggedUserForm) {
        return this.userBackofficeService.updateLoggedUser(body);
    }

}

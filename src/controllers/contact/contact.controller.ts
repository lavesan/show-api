import { Controller, Post, Body, Headers, Put, Get, Delete, Param } from '@nestjs/common';
import { ContactService } from 'src/services/contact/contact.service';
import { SaveContactForm } from 'src/model/forms/contact/SaveContactForm';
import { UpdateContactForm } from 'src/model/forms/contact/UpdateContactForm';
import { DeleteResult } from 'typeorm';

@Controller('contact')
export class ContactController {

    constructor(
        private readonly contactService: ContactService,
    ) {}

    @Post('user')
    saveManyWithToken(
        @Body() contact: SaveContactForm[],
        @Headers('authorization') tokenAuth: string,
    ) {
        return this.contactService.saveManyWithAuth(contact, tokenAuth);
    }

    @Put('user')
    updateOne(@Body() contact: UpdateContactForm) {
        return this.contactService.update(contact);
    }

    @Get('user')
    findAllofUser(@Headers('authorization') tokenAuth: string) {
        return this.contactService.findWithToken(tokenAuth);
    }

    @Delete('user/:id')
    deleteOne(@Param('id') contactId: number): Promise<DeleteResult> {
        return this.contactService.delete(contactId);
    }

}

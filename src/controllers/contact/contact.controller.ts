import { Controller, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { ContactService } from 'src/services/contact/contact.service';
import { SaveContactForm } from 'src/model/forms/contact/SaveContactForm';
import { UpdateContactForm } from 'src/model/forms/contact/UpdateContactForm';
import { DeleteResult } from 'typeorm';

@Controller('contact')
export class ContactController {

    constructor(
        private readonly contactService: ContactService,
    ) {}

    @Post()
    saveOne(@Body() contact: SaveContactForm) {
        return this.contactService.save(contact);
    }

    @Put()
    updateOne(@Body() contact: UpdateContactForm) {
        return this.contactService.update(contact);
    }

    @Delete(':id')
    deleteOne(@Param('id') contactId: number): Promise<DeleteResult> {
        return this.contactService.delete(contactId);
    }

}

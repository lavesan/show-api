import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from 'src/entities/contact.entity';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { decodeToken } from 'src/helpers/auth.helpers';
import { SaveContactForm } from 'src/model/forms/contact/SaveContactForm';
import { UpdateContactForm } from 'src/model/forms/contact/UpdateContactForm';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactEntity)
        private readonly contactRepo: Repository<ContactEntity>,
    ) {}

    async findWithToken(tokenAuth: string) {
        const tokenObj = decodeToken(tokenAuth);

        if (tokenObj) {
            return this.findAllByUserId(tokenObj.id);
        }
    }

    async findAllByUserId(userId: number): Promise<ContactEntity[]> {
        return await this.contactRepo.find({ user: { id: userId } });
    }

    async save({ userId, ...contact }: SaveContactForm): Promise<ContactEntity> {

        const data = {
            ...contact,
            user: { id: userId },
            creationDate: new Date(),
        };

        return await this.contactRepo.save(data);

    }

    async update({ contactId, ...contact }: UpdateContactForm): Promise<UpdateResult> {
        const data = {
            ...contact,
            updateDate: new Date(),
        }

        return await this.contactRepo.update({ id: contactId }, data);
    }

    async delete(contactId: number): Promise<DeleteResult> {
        return await this.contactRepo.delete({ id: contactId });
    }

}

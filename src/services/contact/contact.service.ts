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

    findWithToken(tokenAuth: string) {
        const tokenObj = decodeToken(tokenAuth);

        if (tokenObj) {
            return this.findAllByUserId(tokenObj.id);
        }
    }

    findAllByUserId(userId: number): Promise<ContactEntity[]> {
        return this.contactRepo.find({ user: { id: userId } });
    }

    save({ userId, ...contact }: SaveContactForm): Promise<ContactEntity> {

        const data = {
            ...contact,
            user: { id: userId },
            creationDate: new Date(),
        };

        return this.contactRepo.save(data);

    }

    update({ contactId, ...contact }: UpdateContactForm): Promise<UpdateResult> {
        const data = {
            ...contact,
            updateDate: new Date(),
        }

        return this.contactRepo.update({ id: contactId }, data);
    }

    delete(contactId: number): Promise<DeleteResult> {
        return this.contactRepo.delete({ id: contactId });
    }

    findOneById(contactId: number) {
        return this.contactRepo.findOne({ id: contactId });
    }

}

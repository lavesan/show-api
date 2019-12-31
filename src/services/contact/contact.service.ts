import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactEntity } from 'src/entities/contact.entity';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { decodeToken } from 'src/utils/auth.utils';
import { SaveContactForm } from 'src/model/forms/contact/SaveContactForm';
import { UserService } from '../user/user.service';
import { UpdateContactForm } from 'src/model/forms/contact/UpdateContactForm';

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(ContactEntity)
        private readonly contactRepo: Repository<ContactEntity>,
        private readonly userService: UserService,
    ) {}

    async saveManyWithAuth(contacts: SaveContactForm[], tokenAuth: string) {
        const tokenObj = decodeToken(tokenAuth);

        if (tokenObj) {
            const user = await this.userService.findById(tokenObj.id);

            if (user) {
                for (const contact of contacts) {
                    const data = {
                        ...contact,
                        user,
                    };

                    await this.save(data);
                }
            }
        }
    }

    /**
     * @description Filter data saved, os it won't return to the client
     * @param body 
     */
    async filterSave(body): Promise<any> {
        await this.save(body);

        return {
            code: 1,
            message: 'contato salvo',
        }
    }

    async findWithToken(tokenAuth: string) {
        const tokenObj = decodeToken(tokenAuth);

        if (tokenObj) {
            return this.findByUserId(tokenObj.id);
        }
    }

    async findByUserId(userId: number): Promise<ContactEntity[]> {
        return await this.contactRepo.find({ id: userId });
    }

    async save(contact: Partial<ContactEntity>): Promise<ContactEntity> {
        const data = {
            ...contact,
            creationDate: new Date(),
        }

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

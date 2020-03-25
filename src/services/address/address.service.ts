import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/entities/address.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SaveAddressForm } from 'src/model/forms/address/SaveAddressForm';
import { decodeToken } from 'src/helpers/auth.helpers';
import { UpdateAddressForm } from 'src/model/forms/address/UpdateAddressForm';
import { IUpdateAddress } from 'src/model/types/address.types';

@Injectable()
export class AddressService {

    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepo: Repository<AddressEntity>,
    ) {}

    save({ userId, ...address }: SaveAddressForm): Promise<any> {

        const data = {
            ...address,
            user: userId ? { id: userId } : null,
            creationDate: new Date(),
        };

        return this.addressRepo.save(data);

    }

    async updateWithToken(address: UpdateAddressForm, token: string) {
        const tokenObj = decodeToken(token);

        if (tokenObj) {
            const data = {
                ...address,
                userId: tokenObj.id,
            }

            return this.update(data);
        }
    }

    async update({ userId, id, ...address }: IUpdateAddress): Promise<any> {

        const data = {
            ...address,
            updateDate: new Date(),
            user: { id: userId },
        };

        return await this.addressRepo.update({ id }, data);

    }

    async delete(addressId: number): Promise<DeleteResult> {
        return await this.addressRepo.delete({ id: addressId });
    }

    /**
     * @description Finds user addresses with the auth token
     * @param token 
     */
    async findAddressesWithToken(token: string) {
        const { id } = decodeToken(token);
        return this.findAllByUserId(id);
    }

    findAllByUserId(userId: number): Promise<any> {
        return this.addressRepo.find({ user: { id: userId } });
    }

    findOneById(addressId: number) {
        return this.addressRepo.findOne({ id: addressId });
    }

}

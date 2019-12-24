import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from 'src/entities/address.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SaveAddressForm } from 'src/model/forms/address/SaveAddressForm';
import { decodeToken } from 'src/utils/auth.utils';
import { UpdateAddressForm } from 'src/model/forms/address/UpdateAddressForm';
import { IUpdateAddress } from 'src/model/types/address.types';
import { UserService } from '../user/user.service';

@Injectable()
export class AddressService {
    constructor(
        @InjectRepository(AddressEntity)
        private readonly addressRepo: Repository<AddressEntity>,
        private readonly userService: UserService,
    ) {}

    async save(address: SaveAddressForm): Promise<any> {
        const data = {
            ...address,
            creationDate: new Date(),
        }
        return await this.addressRepo.save(data);
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

    async update({ userId, ...address }: IUpdateAddress): Promise<any> {
        const user = await this.userService.findOneByIdOrFail(userId);
        const data = {
            ...address,
            updateDate: new Date(),
            user,
        }

        return await this.addressRepo.update({ id: address.id, user }, data);
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
        return this.findAddressesByUserId(id);
    }

    async findAddressesByUserId(userId: number): Promise<any> {
        return this.addressRepo.find({ user: { id: userId } });
    }

    private async findAllByUserId(userId: number): Promise<any> {
        return await this.addressRepo.find({ user: { id: userId } });
    }
}

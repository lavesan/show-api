import { Controller, Get, Post, Body, Put, Headers, Delete, Param } from '@nestjs/common';
import { AddressService } from 'src/services/address/address.service';
import { SaveAddressForm } from 'src/model/forms/address/SaveAddressForm';
import { UpdateAddressForm } from 'src/model/forms/address/UpdateAddressForm';
import { DeleteResult } from 'typeorm';

@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Get('all')
    findAllByUser(@Headers('authorization') tokenAuth: string) {
        return this.addressService.findAddressesWithToken(tokenAuth);
    }

    @Post()
    saveOne(@Body() address: SaveAddressForm) {
        return this.addressService.save(address);
    }

    @Put()
    updateOne(@Body() address: UpdateAddressForm, @Headers('authorization') token: string) {
        return this.addressService.updateWithToken(address, token);
    }

    @Delete(':id')
    deleteOne(@Param('id') addressId: number): Promise<DeleteResult> {
        return this.addressService.delete(addressId);
    }
}

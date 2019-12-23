import { Controller, Get, Post, Body, Put, Headers } from '@nestjs/common';
import { AddressService } from 'src/services/address/address.service';
import { SaveAddressForm } from 'src/model/forms/address/SaveAddressForm';
import { UpdateAddressForm } from 'src/model/forms/address/UpdateAddressForm';

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
    updateOne(@Body() address: UpdateAddressForm, @Headers('authorization') tokenAuth: string) {
        return this.addressService.updateWithToken(address, tokenAuth);
    }
}

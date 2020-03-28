import { UserEntity } from "src/entities/user.entity";
import { CardEntity } from "src/entities/card.entity";
import { AddressEntity } from "src/entities/address.entity";
import { ContactEntity } from "src/entities/contact.entity";

export interface TokenPayloadType {
    login: string;
    role: number;
    id: number;
    name: string;
    type: 'admin' | 'ecommerce';
}

export interface IUserLoginReturnedData extends Partial<UserEntity> {
    cards: CardEntity[];
    addresses: AddressEntity[];
    contacts: ContactEntity[];
}

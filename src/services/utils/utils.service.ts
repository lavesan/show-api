import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UtilsEntity } from 'src/entities/user.entity';

@Injectable()
export class UtilsService {

    constructor(
        @InjectRepository(UtilsEntity)
        private readonly userRepo: Repository<UtilsEntity>,
    ) {}

    save(body: UtilsEntity) {

        let data = body;
        if (body.equalAddress) {
            data = {
                ...data,
                nameWhoReceives: data.name,
                addressWhoReceives: data.address1,
                cpfSent: '',
                address2: data.address1,
                complement2: data.complement,
                city2: data.city,
                state2: data.state,
                cep2: data.cep,
                country2: data.country,
            }
        }

        return this.userRepo.save(data);

    }

    findAll(): Promise<UtilsEntity[]> {
        return this.userRepo.find();
    }

}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UtilsEntity } from 'src/entities/user.entity';
import { FilterForm } from 'src/models/FilterForm';

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

    findAll(filter: FilterForm[]): Promise<UtilsEntity[]> {

        const builder = this.userRepo.createQueryBuilder();

        filter.forEach(filt => {
            builder.where(`${filt.field} ILIKE '%${filt.value}%'`);
        });

        return builder.getMany();

    }

}

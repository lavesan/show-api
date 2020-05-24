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
        return this.userRepo.save(body);
    }

    findAll(): Promise<UtilsEntity[]> {
        return this.userRepo.find();
    }

}

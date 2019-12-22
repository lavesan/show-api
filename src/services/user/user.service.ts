import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../../entities/user.entity';
import { RegisterUserForm } from '../../model/forms/user/RegisterUserForm';
import { UserRole, UserStatus } from '../../model/constants/user.constants';
import { generateHashPwd, comparePwdWithHash } from '../../utils/auth.utils';
import { LoginUserForm } from 'src/model/forms/user/LoginUserForm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    async save(user: RegisterUserForm): Promise<any> {
        // TODO: Salvar a role em um local separado para Lis setá-la no backoffice
        const data = {
            ...user,
            status: UserStatus.ACTIVE,
            role: UserRole.NENHUM,
            creationDate: new Date(),
            password: generateHashPwd(user.password),
        };
        return await this.userRepo.save(data);
    }

    async update(user: RegisterUserForm): Promise<any> {
        const data = {
            ...user,
            updateDate: new Date(),
        }
        return await this.userRepo.update({ email: user.email }, data);
    }

    /**
     * @description Uses bcrypt to compare the password
     * @param param0 
     */
    async loginUser({ login, password }): Promise<any> {
        // Para o modo `eager` funcionar, preciso pesquisar com os métodos `find`, `findOne`, `findAndCount`...
        // ! Não utilizar o `createQueryBuilder`, senão tudo perdido e precisarei usar o `leftJoin` e pa
        const user = await this.userRepo.findOne({
            where: { email: login, status: UserStatus.ACTIVE }
        });

        if (user) {
            if (comparePwdWithHash(password, user.password)) {
                // Encontrou o usuário e a senha está correta
                // const establishments = await user.establishments;
                // const establishmentsIds = establishments.map(est => est.id);

                // delete user.password;
                // const userData = {
                //     ...user,
                //     establishmentsIds,
                // }
                // return await Promise.resolve(userData);
            } else {
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: 'Senha incorreta',
                }, HttpStatus.NOT_ACCEPTABLE);
            }
        }
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);
    }

    async updatePassword({ login, password }: LoginUserForm): Promise<any> {
        const user = await this.userRepo.findOne({
            where: { login , status: 1 },
        });
        
        if (user) {
            user.updateDate = new Date();
            user.password = generateHashPwd(password);

            return await this.userRepo.update({ email: login }, user);
        }
        throw new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: 'Usuário não encontrado',
        }, HttpStatus.NOT_FOUND);
    }
}

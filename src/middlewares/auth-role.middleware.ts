
import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwtDecode from 'jwt-decode';

import { UserBackofficeRole } from 'src/model/constants/user-backoffice.constants';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    if (req.headers.authorization) {
        // Assim eu verifico se o usuário tem a role necessária
        const { role } = jwtDecode(req.headers.authorization);

        if(role === UserBackofficeRole.ADMIN) {
            next();
        } else {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Tipo de usuário inválido',
            }, HttpStatus.FORBIDDEN);
        }
    }
    throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Token de autorização inválido',
    }, HttpStatus.FORBIDDEN);
  }
}
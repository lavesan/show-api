import * as bcrypt from 'bcryptjs';
import * as jwtDecode from 'jwt-decode';
import { verify } from 'jsonwebtoken';

import { TokenPayloadType } from 'src/model/types/user.types';
import { HttpException, HttpStatus } from '@nestjs/common';

interface IDecodeTokenType extends TokenPayloadType {
    // Timestamp de criação do token
    iat: number;
    // Timestamp de expiração do token
    exp: number;
}

export const generateHashPwd = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const comparePwdWithHash = (passowrd: string, hashPwd: string): boolean => {
    return bcrypt.compareSync(passowrd, hashPwd);
}

export const decodeToken = (token: string): IDecodeTokenType | null => {
    if (token) {
        return jwtDecode(token);
    }
    return null;
}

export const validateToken = ({ secretKey, req, next }) => {

    const bearerTokenString: string = req.headers.authorization;

    if (!bearerTokenString) {

        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Token de autorização inválido',
        }, HttpStatus.FORBIDDEN);

    }

    const tokenReg = /[^ ]+$/
    const token = bearerTokenString.match(tokenReg).toString();
    // Assim eu verifico se o usuário tem a role necessária
    // const { role } = jwtDecode(req.headers.authorization);

    try {

        const decoded = verify(token, secretKey);
        req.user = decoded;
        next();

    } catch(e) {

        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'Token de autorização inválido',
        }, HttpStatus.FORBIDDEN);

    }
}

export enum AUTH_CONSTS {
    CLIENT = 'jwt',
    ADMIN = 'jwt-admin',
}

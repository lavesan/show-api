import * as bcrypt from 'bcryptjs';
import * as jwtDecode from 'jwt-decode';

import { TokenPayloadType } from 'src/model/types/user.types';

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
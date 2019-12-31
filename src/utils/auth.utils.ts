import * as bcrypt from 'bcryptjs';
import * as jwtDecode from 'jwt-decode';

import { TokenPayloadType } from 'src/model/types/user.types';

export const generateHashPwd = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const comparePwdWithHash = (passowrd: string, hashPwd: string): boolean => {
    return bcrypt.compareSync(passowrd, hashPwd);
}

export const decodeToken = (token: string): TokenPayloadType | null => {
    if (token) {
        return jwtDecode(token);
    }
    return null;
}
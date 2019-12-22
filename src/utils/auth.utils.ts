import * as bcrypt from 'bcryptjs';

export const generateHashPwd = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const comparePwdWithHash = (passowrd: string, hashPwd: string): boolean => {
    return bcrypt.compareSync(passowrd, hashPwd);
}
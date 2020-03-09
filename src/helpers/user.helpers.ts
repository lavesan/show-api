import { UserEntity } from "src/entities/user.entity";
import { UserBackofficeEntity } from "src/entities/user-backoffice.entity";

export const removePwd = (user: UserEntity) => {

    delete user.password;
    delete user.forgotPassword;
    delete user.forgotPasswordCreation;

    return user;

}

export const removeAdminPwd = (user: UserBackofficeEntity) => {

    delete user.password;
    delete user.forgotPassword;
    delete user.forgotPasswordCreation;
    delete user.resetPassowrdToken;

    return user;

}
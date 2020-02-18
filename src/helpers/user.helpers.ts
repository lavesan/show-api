import { UserEntity } from "src/entities/user.entity";

export const removePwd = (user: UserEntity) => {

    delete user.password;
    delete user.forgotPassword;
    delete user.forgotPasswordCreation;

    return user;

}
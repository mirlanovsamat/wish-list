import { ICreateUser } from './create-user.interface';

export interface IUpdateUser extends Partial<ICreateUser> {}

export interface ICreateUser {
  username: string;
  email: string;
  password: string;
  name?: string;
  familyName?: string;
  gender?: string;
  birthDay?: string;
  location?: string;
  bio?: string;
  staticObjectId?: number;
}

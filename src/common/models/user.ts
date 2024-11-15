import { StaticObject } from './static-object';
import { Wish } from './wish';
export class User {
  id: number;
  name: string | null;
  familyName: string | null;
  gender: string | null;
  birthDay: string | null;
  location: string | null;
  bio: string | null;
  username: string;
  email: string;
  password: string;
  staticObjectId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  staticObject: StaticObject | null;
  wishes: Wish[] | null;
  followers?: User[] | null;
  following?: User[] | null;
}

import { StaticObject } from './static-object';

export class Wish {
  id: number;
  link: string;
  description: string;
  giftName: string;
  price: number;
  desireRate: number;
  staticObjectId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  staticObject?: StaticObject;
}

import { StaticObject } from './static-object';

export class Wish {
  id: number;
  link: string | null;
  description: string | null;
  giftName: string | null;
  price: number | null;
  desireRate: number | null;
  status: boolean;
  staticObjectId: number;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  staticObject?: StaticObject;
}

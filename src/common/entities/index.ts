import { WishEntity } from './wish.entity';
import { UserRefreshTokenEntity } from './user-refresh-token.entity';
import { UserEntity } from './user.entity';
import { StaticObjectEntity } from './static-object.entity';

export const dbEntities = [
  UserRefreshTokenEntity,
  UserEntity,
  WishEntity,
  StaticObjectEntity,
];

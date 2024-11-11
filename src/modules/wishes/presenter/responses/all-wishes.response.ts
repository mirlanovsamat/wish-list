import { ApiProperty } from '@nestjs/swagger';
import { WishResponse } from './wish.response';

export class AllWishesResponse {
  @ApiProperty({
    description: 'Wishes object',
    type: [WishResponse],
  })
  wishes: WishResponse[];
}

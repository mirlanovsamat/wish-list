import { ApiProperty } from '@nestjs/swagger';
import { WishResponse } from './wish.response';

export class OneWishResponseType {
  @ApiProperty({
    description: `Wish object`,
    type: WishResponse,
  })
  wish: WishResponse;
}

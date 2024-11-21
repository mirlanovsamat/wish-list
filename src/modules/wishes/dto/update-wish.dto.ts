import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { WishStatus } from 'src/common/constants/wish-status';

export class UpdateWishDto {
  @ApiProperty({
    description: 'Wish status',
    example: WishStatus.ACTIVE,
    enum: WishStatus,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsEnum(WishStatus)
  status: WishStatus;
}

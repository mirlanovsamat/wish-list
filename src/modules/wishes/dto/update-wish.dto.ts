import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { WishStatus } from 'src/common/constants/wish-status';

export class UpdateWishDto {
  @ApiProperty({
    description: 'Wish status',
    example: WishStatus.ACTIVE,
    enum: WishStatus,
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(WishStatus)
  status: WishStatus;
}

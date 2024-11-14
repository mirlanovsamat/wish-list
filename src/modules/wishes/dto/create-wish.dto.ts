import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateWishDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  giftName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  desireRate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  staticObjectId: number;
}

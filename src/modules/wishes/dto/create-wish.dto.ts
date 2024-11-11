import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishDto {
  @IsString()
  @ApiProperty({ description: 'Title of the wish' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'URL for the wish' })
  url: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Photo of the wish',
  })
  url: MultipartFile;
}

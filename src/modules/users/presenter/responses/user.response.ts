import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WishResponse } from 'src/modules/wishes/presenter/responses/wish.response';

export class UserResponseType {
  @ApiProperty({
    description: `User's id`,
    type: Number,
    example: 1,
  })
  id: string;

  @ApiProperty({
    description: `User's username`,
    type: String,
    example: 'John Doe',
  })
  username: string;

  @ApiProperty({
    description: `User's email`,
    type: String,
    example: 'umutable@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: `User's birth date`,
    type: String,
    example: '2022-12-31',
    format: 'date',
    nullable: true,
  })
  birthDate: string;

  @ApiProperty({
    description: `User's created at timestamp`,
    type: String,
    example: '2022-12-31T18:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: `User's updated at timestamp`,
    type: String,
    example: '2022-12-31T18:00:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: `User's created at timestamp`,
    type: String,
    example: '2022-12-31T18:00:00.000Z',
    nullable: true,
  })
  deletedAt: string;

  @ApiPropertyOptional({
    description: `User's wishes`,
  })
  wishes: WishResponse[];
}

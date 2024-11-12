import { ApiProperty } from '@nestjs/swagger';
import { StaticObjectResponseType } from 'src/modules/static-objects/responses/static-object.response';
import { UserResponseType } from 'src/modules/users/presenter/responses/user.response';

export class WishResponse {
  @ApiProperty({
    description: `Wish id`,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: `Wish title`,
    example: 1,
  })
  title?: string;

  @ApiProperty({
    description: `Wish user id`,
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: `Wish static object id`,
    example: 1,
  })
  staticObjectId: number;

  @ApiProperty({
    description: `Place reaction creation date`,
    example: '2023-12-27T12:00:00Z',
  })
  createdAt: string;

  @ApiProperty({
    name: 'user',
    type: UserResponseType,
  })
  user: UserResponseType;

  @ApiProperty({
    name: 'static_object',
    type: StaticObjectResponseType,
  })
  staticObject: StaticObjectResponseType;
}

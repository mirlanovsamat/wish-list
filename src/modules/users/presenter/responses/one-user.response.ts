import { ApiProperty } from '@nestjs/swagger';
import { UserResponseType } from './user.response';

export class OneUserResponseType {
  @ApiProperty({
    description: `User object`,
    type: UserResponseType,
  })
  user: UserResponseType;
}

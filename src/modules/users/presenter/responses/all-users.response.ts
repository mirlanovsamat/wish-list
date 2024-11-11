import { ApiProperty } from '@nestjs/swagger';
import { UserResponseType } from './user.response';

export class AllUsersResponseType {
  @ApiProperty({
    description: 'Users objects array',
    type: [UserResponseType],
  })
  users: UserResponseType[];
}

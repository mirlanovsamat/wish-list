import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { ApiNotFoundExceptionResponse } from 'src/common/decorators/exception-responses/api-not-found-exception-response.decorator';
import { ApiUnauthorizedExceptionResponse } from 'src/common/decorators/exception-responses/api-unauthorized-exception-response.decorator';

import { UserAccessJwtGuard } from 'src/modules/auth/guards/user-access-jwt.guard';
import { UsersService } from '../domain/users.service';
import { UserResponseType } from './responses/user.response';
import { AuthenticatedUserObject } from 'src/modules/auth/models/authenticated-user-object.model';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User object successfully fetched',
    type: UserResponseType,
  })
  @ApiUnauthorizedExceptionResponse()
  @ApiNotFoundExceptionResponse({ message: 'User with id 4 does not exist' })
  @UseGuards(UserAccessJwtGuard)
  @Get('me')
  async getCurrentUser(@AuthenticatedUser() user: AuthenticatedUserObject) {
    return {
      user: await this.usersService.getOneById(user.userId),
    };
  }
}

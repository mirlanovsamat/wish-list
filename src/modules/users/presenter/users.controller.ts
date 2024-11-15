import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { ApiNotFoundExceptionResponse } from 'src/common/decorators/exception-responses/api-not-found-exception-response.decorator';
import { ApiUnauthorizedExceptionResponse } from 'src/common/decorators/exception-responses/api-unauthorized-exception-response.decorator';

import { UserAccessJwtGuard } from 'src/modules/auth/guards/user-access-jwt.guard';
import { UsersService } from '../domain/users.service';
import { UserResponseType } from './responses/user.response';
import { AuthenticatedUserObject } from 'src/modules/auth/models/authenticated-user-object.model';
import { ApiConflictExceptionResponse } from 'src/common/decorators/exception-responses/api-conflict-exception-response.decorator';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { OneUserResponseType } from './responses/one-user.response';
import { GetAllUsersQuery } from './queries/get-all-users.query';
import { AllUsersResponseType } from './responses/all-users.response';
import { ApiBadRequestExceptionResponse } from 'src/common/decorators/exception-responses/api-bad-request-exception-response.decorator';

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

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'User updated successfully',
    type: OneUserResponseType,
  })
  @ApiUnauthorizedExceptionResponse()
  @ApiNotFoundExceptionResponse({ message: 'User with id 4 does not exist' })
  @ApiConflictExceptionResponse({ message: 'Username jack is already taken' })
  @UseGuards(UserAccessJwtGuard)
  @Patch('me')
  async updateCurrentUser(
    @AuthenticatedUser() user: AuthenticatedUserObject,
    @Body() body: UpdateUserDto,
  ) {
    return {
      user: await this.usersService.updateUserFields(user.userId, body),
    };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedExceptionResponse()
  @ApiOkResponse({
    description: 'All users successfully fetched',
    type: AllUsersResponseType,
  })
  @UseGuards(UserAccessJwtGuard)
  @Get()
  async getAllUsers(@Query() query: GetAllUsersQuery) {
    const [users, total] = await this.usersService.getAllUsers(query);
    return {
      users,
      meta: {
        total,
        page: query.page,
        perPage: query.perPage,
      },
    };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedExceptionResponse()
  @ApiOkResponse({
    description: 'User successfully followed',
    type: OneUserResponseType,
  })
  @ApiBadRequestExceptionResponse({ message: 'Some bad exception' })
  @UseGuards(UserAccessJwtGuard)
  @Patch('follow/:followee_id')
  async followUser(
    @Param('followee_id') followeeId: number,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    return {
      user: await this.usersService.followUser(followeeId, user.userId),
    };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedExceptionResponse()
  @ApiOkResponse({
    description: 'User successfully unfollowed',
    type: OneUserResponseType,
  })
  @ApiBadRequestExceptionResponse({ message: 'Some bad exception' })
  @UseGuards(UserAccessJwtGuard)
  @Patch('unfollow/:followee_id')
  async unfollowUser(
    @Param('followee_id') followeeId: number,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    return {
      user: await this.usersService.unfollowUser(followeeId, user.userId),
    };
  }
}

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../domain/auth.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { AuthTokensResponseType } from './responses/auth-tokens.response';
import { LoginUserDto } from '../dtos/login-user.dto';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { UserRefreshJwtGuard } from '../guards/user-refresh-jwt.guard';
import { ApiConflictExceptionResponse } from 'src/common/decorators/exception-responses/api-conflict-exception-response.decorator';
import { ApiNotFoundExceptionResponse } from 'src/common/decorators/exception-responses/api-not-found-exception-response.decorator';
import { ApiBadRequestExceptionResponse } from 'src/common/decorators/exception-responses/api-bad-request-exception-response.decorator';
import { ApiUnauthorizedExceptionResponse } from 'src/common/decorators/exception-responses/api-unauthorized-exception-response.decorator';
import { AuthenticatedUserObject } from '../models/authenticated-user-object.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'User successfully registered',
    type: AuthTokensResponseType,
  })
  @ApiConflictExceptionResponse({
    message: 'User with example@gmail.com email already registered',
  })
  @Post('register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.register(body);
  }

  @ApiCreatedResponse({
    description: 'User successfully logged in',
    type: AuthTokensResponseType,
  })
  @ApiNotFoundExceptionResponse({
    message: 'User with example@gmail.com email does not exist',
  })
  @ApiBadRequestExceptionResponse({ message: 'User has not set password yet' })
  @ApiUnauthorizedExceptionResponse({ message: 'Invalid password' })
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Successful logout',
  })
  @ApiUnauthorizedResponse()
  @UseGuards(UserRefreshJwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@AuthenticatedUser() user: AuthenticatedUserObject) {
    return this.authService.logout(user.userId);
  }

  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Successfull refreshed tokens',
    type: AuthTokensResponseType,
  })
  @ApiUnauthorizedExceptionResponse({
    message: [
      'Unauthorized',
      'Refresh token is invalid',
      'Refresh token has expired',
    ],
  })
  @ApiNotFoundExceptionResponse({
    message: 'User with 2342 id does not exist',
  })
  @UseGuards(UserRefreshJwtGuard)
  @Post('refresh-tokens')
  refreshTokens(@AuthenticatedUser() user: AuthenticatedUserObject) {
    const { refreshToken, userId } = user;

    return this.authService.refreshTokens(userId, refreshToken);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiUnauthorizedExceptionResponse } from 'src/common/decorators/exception-responses/api-unauthorized-exception-response.decorator';

import { WishesService } from '../domain/wishes.service';
import { UserAccessJwtGuard } from '../../auth/guards/user-access-jwt.guard';
import { AllWishesResponse } from './responses/all-wishes.response';
import { GetAllWishesQuery } from './queries/get-all-wishes.query';
import { WishResponse } from './responses/wish.response';
import { ApiNotFoundExceptionResponse } from 'src/common/decorators/exception-responses/api-not-found-exception-response.decorator';
import { ApiBadRequestExceptionResponse } from 'src/common/decorators/exception-responses/api-bad-request-exception-response.decorator';
import { CreateWishDto } from '../dto/create-wish.dto';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { AuthenticatedUserObject } from 'src/modules/auth/models/authenticated-user-object.model';
import { OneWishResponseType } from './responses/one-wish.response';

@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedExceptionResponse()
  @ApiOkResponse({
    description: 'Wish successfully created',
    type: WishResponse,
  })
  @ApiNotFoundExceptionResponse({
    message: 'Exception indicated that some resource was not found',
  })
  @ApiBadRequestExceptionResponse({
    message:
      'Exception indicated that the request payload or parameters was not valid',
  })
  @UseGuards(UserAccessJwtGuard)
  @Post('/')
  async create(
    @Body() body: CreateWishDto,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    return {
      review: await this.wishesService.createReview({
        ...body,
        userId: user.userId,
      }),
    };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedExceptionResponse()
  @ApiOkResponse({
    description: 'All wishes successfully fetched',
    type: AllWishesResponse,
  })
  @UseGuards(UserAccessJwtGuard)
  @Get()
  async getAllWishes(@Query() query: GetAllWishesQuery) {
    const [wishes, total] = await this.wishesService.getAllWishes(query);
    return {
      wishes,
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
    description: 'Wish successfully fetched',
    type: OneWishResponseType,
  })
  @UseGuards(UserAccessJwtGuard)
  @Get(':wish_id')
  async getWishById(@Param('wish_id') wishId: number) {
    return {
      wish: await this.wishesService.getOneById(wishId),
    };
  }

  @ApiBearerAuth()
  @ApiUnauthorizedExceptionResponse()
  @ApiOkResponse({
    description: 'Wish successfully copied',
    type: OneWishResponseType,
  })
  @UseGuards(UserAccessJwtGuard)
  @Post('copy/:wish_id')
  async copyWishById(
    @Param('wish_id') wishId: number,
    @AuthenticatedUser() user: AuthenticatedUserObject,
  ) {
    return {
      wish: await this.wishesService.copyOneById(wishId, user.userId),
    };
  }
}

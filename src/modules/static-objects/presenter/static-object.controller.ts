import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { ApiUnauthorizedExceptionResponse } from 'src/common/decorators/exception-responses/api-unauthorized-exception-response.decorator';
import { ApiBadRequestExceptionResponse } from 'src/common/decorators/exception-responses/api-bad-request-exception-response.decorator';
import { StaticObjectService } from '../domain/static-objects.service';
import { StaticObjectResponseType } from '../responses/static-object.response';
import { UserAccessJwtGuard } from 'src/modules/auth/guards/user-access-jwt.guard';
import { ApiFileBody } from 'src/common/decorators/image-api-body.decorator';
import { ApiInternalServerExceptionResponse } from 'src/common/decorators/exception-responses/api-internal-server-exception-response.decorator';

@ApiTags('Static objects')
@Controller('static-object')
export class StaticObjectController {
  constructor(private readonly staticObjectService: StaticObjectService) {}

  @ApiConsumes('multipart/form-data')
  @ApiFileBody()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Icon uploaded successfully',
    type: StaticObjectResponseType,
  })
  @ApiUnauthorizedExceptionResponse()
  @ApiInternalServerExceptionResponse({
    description: 'Error uploading icon',
    message: 'Error while processing the request',
  })
  @ApiBadRequestExceptionResponse({
    message: 'This file extension .pdf is not supported',
  })
  @UseGuards(UserAccessJwtGuard)
  @Post()
  async uploadIcon(@Request() request: FastifyRequest) {
    const data = await request.file();
    const icon = await this.staticObjectService.uploadAndSaveOneIcon(data, {
      mimeType: data.mimetype,
    });

    return {
      icon,
    };
  }
}

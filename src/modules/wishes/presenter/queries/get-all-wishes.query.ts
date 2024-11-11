import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetAllWithPaginationQuery } from '../../../../common/queries/get-all-with-pagination.query';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllWishesQuery extends GetAllWithPaginationQuery {
  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  userId?: number;
}

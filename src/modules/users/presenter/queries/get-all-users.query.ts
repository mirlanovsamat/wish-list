import { IsNumber, IsOptional, Min } from 'class-validator';
import { GetAllWithPaginationQuery } from '../../../../common/queries/get-all-with-pagination.query';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllUsersQuery extends GetAllWithPaginationQuery {
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  @IsNumber()
  username?: number;
}

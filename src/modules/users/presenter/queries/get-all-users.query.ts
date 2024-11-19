import { IsOptional, IsString } from 'class-validator';
import { GetAllWithPaginationQuery } from '../../../../common/queries/get-all-with-pagination.query';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllUsersQuery extends GetAllWithPaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: number;
}

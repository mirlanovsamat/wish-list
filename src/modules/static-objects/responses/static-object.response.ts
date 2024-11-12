import { ApiProperty } from '@nestjs/swagger';

export class StaticObjectResponseType {
  @ApiProperty({
    description: `Static object id`,
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: `Static object key`,
    type: String,
    example: '00000000-0000-0000-0000-000000000000',
  })
  url: string;

  @ApiProperty({
    description: 'Static object creation date',
    type: String,
    example: '2020-01-01T00:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Static object last update date',
    type: String,
    example: '2020-01-01T00:00:00.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Static object deletion date',
    type: String,
    example: '2020-01-01T00:00:00.000Z',
    nullable: true,
  })
  deletedAt: string | null;
}

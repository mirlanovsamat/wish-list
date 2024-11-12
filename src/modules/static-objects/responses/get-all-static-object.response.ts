import { ApiProperty } from '@nestjs/swagger';
import { StaticObjectResponseType } from './static-object.response';

export class GetAllStaticObjectResponseType {
  @ApiProperty({
    name: 'Static objects',
    type: [StaticObjectResponseType],
  })
  staticObjects: StaticObjectResponseType[];
}

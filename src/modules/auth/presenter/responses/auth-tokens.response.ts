import { ApiProperty } from '@nestjs/swagger';

class TokenResponseType {
  @ApiProperty({
    description: 'JWT token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODM5YzBmZS1lYTM2LTRmMTctODdhZi04NTA5Y2VmN2FjZTEiLCJpYXQiOjE2ODg5MjA3MjIsImV4cCI6MTY5MTUxMjcyMn0.MniDtRVHVGGSbDH3S0Jy_zFBjhhpRS8zsURMzO043A8',
  })
  token: string;

  @ApiProperty({
    example: '2023-08-30T15:15:00.198Z',
    description: 'JWT token expiration date',
    format: 'date-time',
  })
  expiresAt: string;
}

export class AuthTokensResponseType {
  @ApiProperty({
    description: 'Access token',
    type: TokenResponseType,
  })
  access: TokenResponseType;

  @ApiProperty({
    description: 'Refresh token',
    type: TokenResponseType,
  })
  refresh: TokenResponseType;
}

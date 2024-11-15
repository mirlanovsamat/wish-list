import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ILoginUser } from '../interfaces/login.interface';

export class LoginUserDto implements ILoginUser {
  @ApiProperty({
    description: 'User email',
    example: 'umutable@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    description: 'User password',
    minimum: 6,
    example: '12345678nktL!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

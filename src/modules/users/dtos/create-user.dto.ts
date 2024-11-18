import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  NotContains,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { ICreateUser } from '../interfaces/create-user.interface';

export class CreateUserDto implements ICreateUser {
  @ApiProperty({
    description: 'User username',
    example: 'Umutable',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @NotContains(' ', { message: 'No spaces allowed' })
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'umutable@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  @Matches(/^[a-zA-Z0-9.,!?'"@#$%^&*(){}\[\]:;<>/\\|_+=\- ]+$/, {
    message:
      'Field must contain only Latin letters, digits, common punctuation marks, and additional symbols',
  })
  email: string;

  @ApiProperty({
    description: 'User password without spaces',
    example: '12345678nktL!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @NotContains(' ', { message: 'No spaces allowed' })
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\W_])[a-zA-Z0-9]*(?:(?![А-Яа-яЁё]).)*$/,
    {
      message:
        'Field must contain at least one uppercase letter and one symbol, may consist of Latin letters, digits, common punctuation marks, and additional symbols',
    },
  )
  password: string;

  @ApiProperty({
    description: 'User name',
    example: 'Umut',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User family name',
    example: 'Arpidinov',
  })
  @IsNotEmpty()
  @IsString()
  familyName: string;

  @ApiProperty({
    description: 'User gender',
    example: 'Male',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'User birth day',
    example: '2024-02-10T23:59:59Z',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDay: string;

  @ApiProperty({
    description: 'User location',
    example: 'My location',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Some bio',
  })
  @IsNotEmpty()
  @IsString()
  bio: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  staticObjectId: number;
}

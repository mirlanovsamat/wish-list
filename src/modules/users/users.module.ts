import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { UsersRepository } from './data/users.repository';
import { UsersController } from './presenter/users.controller';
import { UsersService } from './domain/users.service';
import { StaticObjectsModule } from '../static-objects/static-objects.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), StaticObjectsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}

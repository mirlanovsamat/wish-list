import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WishesService } from './domain/wishes.service';
import { WishesController } from './presenter/wishes.controller';
import { WishEntity } from 'src/common/entities/wish.entity';
import { WishesRepository } from './data/wishes.repository';
import { StaticObjectsModule } from '../static-objects/static-objects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WishEntity]),
    UsersModule,
    StaticObjectsModule,
  ],
  controllers: [WishesController],
  providers: [WishesService, WishesRepository],
})
export class WishesModule {}

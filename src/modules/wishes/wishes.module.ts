import { WishesController } from './wishes.controller';
import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}

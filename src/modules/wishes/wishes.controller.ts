// wishes.controller.ts

import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createWish(@Body() createWishDto: CreateWishDto, @Req() req) {
    const userId = req.user.userId; // Получаем userId из токена
    return this.wishesService.create(createWishDto, userId);
  }
}

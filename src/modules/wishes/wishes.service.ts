import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from 'src/common/entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: { title: string; url: string }, userId: number) {
    const wish = new Wish();
    wish.title = createWishDto.title;
    wish.url = createWishDto.url;
    wish.user = { id: userId } as any;
    return this.wishesRepository.save(wish);
  }
}

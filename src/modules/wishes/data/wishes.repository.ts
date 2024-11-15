import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishEntity } from 'src/common/entities/wish.entity';
import { Wish } from 'src/common/models/wish';
import { GetAllWishesQuery } from '../presenter/queries/get-all-wishes.query';
import { ICreateWish } from '../interfaces/create-review.interface';

@Injectable()
export class WishesRepository {
  constructor(
    @InjectRepository(WishEntity)
    private readonly wishesRepository: Repository<WishEntity>,
  ) {}

  async getOneById(id: number): Promise<Wish> {
    return this.wishesRepository.findOne({
      where: { id },
      relations: ['staticObject'],
    });
  }

  async getAllWishes({
    userId,
    giftName,
    page,
    perPage,
  }: GetAllWishesQuery): Promise<[Wish[], number]> {
    const queryBuilder = this.wishesRepository
      .createQueryBuilder('wish')
      .leftJoinAndSelect('wish.staticObject', 'staticObject');

    if (userId) {
      queryBuilder.where('wish.userId = :userId', { userId });
    }

    if (giftName) {
      queryBuilder.where('wish.giftName ILIKE :giftName', {
        giftName: `%${giftName}%`,
      });
    }

    queryBuilder
      .skip(perPage * (page - 1))
      .take(perPage)
      .orderBy('wish.createdAt', 'DESC');

    return queryBuilder.getManyAndCount();
  }

  async insertAndFetchOne(payload: ICreateWish): Promise<Wish> {
    const wish = this.wishesRepository.create(payload);
    await this.wishesRepository.save(wish);

    return this.getOneById(wish.id);
  }
}

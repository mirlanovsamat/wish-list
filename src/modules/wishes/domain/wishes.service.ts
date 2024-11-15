import { Injectable, NotFoundException } from '@nestjs/common';
import { WishesRepository } from '../data/wishes.repository';
import { GetAllWishesQuery } from '../presenter/queries/get-all-wishes.query';
import { ICreateWish } from '../interfaces/create-review.interface';
import { Wish } from 'src/common/models/wish';
import { StaticObjectsRepository } from 'src/modules/static-objects/data/static-objects.repository';

@Injectable()
export class WishesService {
  constructor(
    private readonly wishesRepository: WishesRepository,
    private readonly staticObjectsRepository: StaticObjectsRepository,
  ) {}

  async getAllWishes(query: GetAllWishesQuery) {
    return this.wishesRepository.getAllWishes(query);
  }

  async getOneById(wishId: number): Promise<Wish> {
    const wish = await this.wishesRepository.getOneById(wishId);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${wishId} does not exist`);
    }

    return wish;
  }

  async copyOneById(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.wishesRepository.getOneById(wishId);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${wishId} does not exist`);
    }
    const staticObject = await this.staticObjectsRepository.insertAndFetchOne(
      wish.staticObject.url,
    );
    delete wish.id;
    return this.wishesRepository.insertAndFetchOne({
      ...wish,
      userId,
      staticObjectId: staticObject.id,
    });
  }

  async createReview(payload: ICreateWish): Promise<Wish> {
    const staticObject = await this.staticObjectsRepository.getOneById(
      payload.staticObjectId,
    );
    if (!staticObject) {
      throw new NotFoundException(
        `Static object with id ${payload.staticObjectId} does not exist`,
      );
    }
    return await this.wishesRepository.insertAndFetchOne(payload);
  }
}

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

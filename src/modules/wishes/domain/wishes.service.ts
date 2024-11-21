import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WishesRepository } from '../data/wishes.repository';
import { GetAllWishesQuery } from '../presenter/queries/get-all-wishes.query';
import { ICreateWish } from '../interfaces/create-wish.interface';
import { Wish } from 'src/common/models/wish';
import { StaticObjectsRepository } from 'src/modules/static-objects/data/static-objects.repository';
import { IUpdateWish } from '../interfaces/update-wish.interface';

@Injectable()
export class WishesService {
  constructor(
    private readonly wishesRepository: WishesRepository,
    private readonly staticObjectsRepository: StaticObjectsRepository,
  ) {}

  async getAllWishes(query: GetAllWishesQuery, ownerId: number) {
    return this.wishesRepository.getAllWishes(query, ownerId);
  }

  async getOneById(wishId: number): Promise<Wish> {
    const wish = await this.wishesRepository.getOneById(wishId);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${wishId} does not exist`);
    }

    return wish;
  }

  async delete(id: number, userId: number) {
    const wish = await this.wishesRepository.getOneById(id);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} does not exist`);
    }
    if (wish.userId != userId) {
      throw new BadRequestException(
        `Wish with id ${id} not owned by user with id ${userId}`,
      );
    }
    return this.wishesRepository.deleteBy({ id });
  }

  async updateStatus(id: number, payload: IUpdateWish, userId: number) {
    const wish = await this.wishesRepository.getOneById(id);
    if (!wish) {
      throw new NotFoundException(`Wish with id ${id} does not exist`);
    }
    if (wish.userId != userId) {
      throw new BadRequestException(
        `Wish with id ${id} not owned by user with id ${userId}`,
      );
    }
    return this.wishesRepository.updateAndFetchById(id, payload);
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
    delete wish.staticObject;
    delete wish['user'];
    return this.wishesRepository.insertAndFetchOne({
      ...wish,
      userId,
      staticObjectId: staticObject.id,
    });
  }

  async createWish(payload: ICreateWish): Promise<Wish> {
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

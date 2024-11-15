import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { User } from 'src/common/models/user';
import { ICreateUser } from '../interfaces/create-user.interface';
import { IUpdateUser } from '../interfaces/update-user.interface';
import { GetAllUsersQuery } from '../presenter/queries/get-all-users.query';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers({
    username,
    page,
    perPage,
  }: GetAllUsersQuery): Promise<[User[], number]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.staticObject', 'staticObject')
      .leftJoinAndSelect('user.wishes', 'wishes');

    if (username) {
      queryBuilder.where('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    queryBuilder
      .skip(perPage * (page - 1))
      .take(perPage)
      .orderBy('user.createdAt', 'DESC');

    return queryBuilder.getManyAndCount();
  }

  getOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
  }

  getOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['wishes'],
    });
  }

  getOneById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['staticObject', 'wishes'],
    });
  }

  insertAndFetchOne(payload: ICreateUser): Promise<User> {
    const user = this.usersRepository.create(payload);
    return this.usersRepository.save(user);
  }

  async updateAndFetchById(
    userId: number,
    payload: IUpdateUser,
  ): Promise<User> {
    await this.usersRepository.update(userId, payload);

    return this.getOneById(userId);
  }
}

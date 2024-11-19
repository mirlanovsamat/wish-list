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

  async getAllUsers(
    { username, page, perPage }: GetAllUsersQuery,
    userId: number,
  ): Promise<[UserEntity[], number]> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.staticObject', 'staticObject')
      .leftJoinAndSelect('user.wishes', 'wishes')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(followers.id)', 'count')
            .from('user_followers', 'followers')
            .where('followers.user_id = user.id')
            .andWhere('followers.follower_id = :userId', { userId }),
        'user_followed',
      )
      .where('user.id != :userId', { userId });

    if (username) {
      queryBuilder.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    const [users, count] = await queryBuilder
      .skip(perPage * (page - 1))
      .take(perPage)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    // Добавляем поле `followed` в каждый объект
    const usersWithFollowed = users.map((user: any) => ({
      ...user,
      followed: user.user_followed > 0,
    }));

    return [usersWithFollowed, count];
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
      relations: [
        'staticObject',
        'wishes',
        'wishes.staticObject',
        'followers',
        'following',
      ],
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

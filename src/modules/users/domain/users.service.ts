import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../data/users.repository';
import { User } from 'src/common/models/user';
import { IUpdateUser } from '../interfaces/update-user.interface';
import { GetAllUsersQuery } from '../presenter/queries/get-all-users.query';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(query: GetAllUsersQuery) {
    return this.usersRepository.getAllUsers(query);
  }

  async getOneById(userId: number): Promise<User> {
    const user = await this.usersRepository.getOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    delete user.password;

    return user;
  }

  async updateUserFields(
    userId: number,
    payload: IUpdateUser,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.getOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    if (payload.username && payload.username !== user.username) {
      const userWithGivenUsername = await this.usersRepository.getOneByUsername(
        payload.username,
      );

      if (userWithGivenUsername) {
        throw new ConflictException(
          `Username ${payload.username} is already taken`,
        );
      }
    }

    if (payload.email && payload.email !== user.email) {
      const existingEmail = await this.usersRepository.getOneByEmail(
        payload.email,
      );
      if (existingEmail) {
        throw new ConflictException(
          `User with email: ${payload.email} already registered`,
        );
      }
    }

    return this.usersRepository.updateAndFetchById(user.id, payload);
  }

  async followUser(followeeId: number, followerId: number): Promise<User> {
    if (followeeId == followerId) {
      throw new BadRequestException(
        `Followee id:${followeeId} can not be same with follower id:${followerId}`,
      );
    }
    const follower = await this.usersRepository.getOneById(followerId);
    if (!follower) {
      throw new NotFoundException(
        `Follower with id ${followerId} does not exist`,
      );
    }

    const followee = await this.usersRepository.getOneById(followeeId);
    if (!followee) {
      throw new NotFoundException(
        `Followee with id ${followeeId} does not exist`,
      );
    }

    if (!followee.followers) {
      followee.followers = [];
    }

    if (followee.followers.some((f) => f.id == followerId)) {
      throw new BadRequestException('User is already a follower');
    }

    followee.followers.push(follower);
    await this.usersRepository.insertAndFetchOne(followee);
    return this.usersRepository.getOneById(followerId);
  }

  async unfollowUser(followeeId: number, followerId: number): Promise<User> {
    if (followeeId == followerId) {
      throw new BadRequestException(
        `Followee id:${followeeId} can not be same with follower id:${followerId}`,
      );
    }

    const follower = await this.usersRepository.getOneById(followerId);
    if (!follower) {
      throw new NotFoundException(
        `Follower with id ${followerId} does not exist`,
      );
    }

    const followee = await this.usersRepository.getOneById(followeeId);
    if (!followee) {
      throw new NotFoundException(
        `Followee with id ${followeeId} does not exist`,
      );
    }

    if (
      !followee.followers ||
      !followee.followers.some((f) => f.id == followerId)
    ) {
      throw new BadRequestException('User is not following');
    }

    followee.followers = followee.followers.filter((f) => f.id != followerId);
    await this.usersRepository.insertAndFetchOne(followee);
    return this.usersRepository.getOneById(followerId);
  }
}

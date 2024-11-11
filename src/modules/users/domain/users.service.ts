import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../data/users.repository';
import { User } from 'src/common/models/user';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getOneById(userId: number): Promise<User> {
    const user = await this.usersRepository.getOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} does not exist`);
    }

    delete user.password;

    return user;
  }
}

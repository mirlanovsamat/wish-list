import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { User } from 'src/common/models/user';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

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

  insertAndFetchOne(payload: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(payload);
    return this.usersRepository.save(user);
  }
}

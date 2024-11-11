import { Injectable } from '@nestjs/common';
import { MinioClientService } from '../minio/minio-client.service';
import { User } from 'src/common/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly minioClientService: MinioClientService,
  ) {}

  async uploadUserPhoto(userId: number, photoBuffer: Buffer) {
    const filePath = `users/${userId}/photo.jpg`;
    return this.minioClientService.uploadPhoto(
      'user-photos',
      filePath,
      photoBuffer,
    );
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { login },
    });
  }
}

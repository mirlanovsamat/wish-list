import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRefreshTokenEntity } from 'src/common/entities/user-refresh-token.entity';
import { UserRefreshToken } from 'src/common/models/user-refresh-token';
import { ICreateUserRefreshToken } from '../interfaces/create-user-refresh-token.interface';

@Injectable()
export class UserRefreshTokensRepository {
  constructor(
    @InjectRepository(UserRefreshTokenEntity)
    private userRefreshTokensRepository: Repository<UserRefreshTokenEntity>,
  ) {}

  async getOneByUserId(userId: number): Promise<UserRefreshToken> {
    return this.userRefreshTokensRepository.findOneBy({ userId });
  }

  async getOneByUserIdAndToken(
    userId: number,
    token: string,
  ): Promise<UserRefreshToken> {
    return this.userRefreshTokensRepository.findOneBy({ userId, token });
  }

  async upsertAndFetchOne(
    payload: ICreateUserRefreshToken,
  ): Promise<UserRefreshToken> {
    const existingRefreshToken =
      await this.userRefreshTokensRepository.findOneBy({
        userId: payload.userId,
      });
    if (existingRefreshToken) {
      await this.userRefreshTokensRepository.update(existingRefreshToken.id, {
        token: payload.token,
        expiresAt: payload.expiresAt,
      });

      return this.userRefreshTokensRepository.findOneBy({
        userId: payload.userId,
      });
    }

    const refreshToken = this.userRefreshTokensRepository.create(payload);
    await this.userRefreshTokensRepository.save(refreshToken);

    return refreshToken;
  }

  async deleteOneByUserId(userId: number): Promise<void> {
    await this.userRefreshTokensRepository.delete({ userId });
  }
}

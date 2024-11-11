import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './presenter/auth.controller';
import { AuthService } from './domain/auth.service';
import { UserRefreshTokenEntity } from 'src/common/entities/user-refresh-token.entity';
import { UserAccessJwtStrategy } from './strategies/user-access-jwt.strategy';
import { UserRefreshJwtStrategy } from './strategies/user-refresh-jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { UserRefreshTokensRepository } from './data/user-refresh-tokens.repository';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UserRefreshTokenEntity])],
  controllers: [AuthController],
  providers: [
    UserAccessJwtStrategy,
    UserRefreshJwtStrategy,
    JwtService,
    AuthService,
    UserRefreshTokensRepository,
  ],
  exports: [],
})
export class AuthModule {}

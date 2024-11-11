import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { getAuthConfig } from 'src/common/configs/auth.config';
import { AuthTokenType } from 'src/common/constants/auth-token-type';
import { UsersRepository } from '../../users/data/users.repository';
import { UserRefreshTokensRepository } from '../data/user-refresh-tokens.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthTokens } from '../models/auth-tokens';

dayjs.extend(utc);

@Injectable()
export class AuthService {
  authConfig = getAuthConfig();

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userRefreshTokensRepository: UserRefreshTokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<AuthTokens> {
    const { email, username, password: rawPassword } = payload;

    const existingEmail = await this.usersRepository.getOneByEmail(email);
    if (existingEmail) {
      throw new ConflictException(
        `User with email: ${email} already registered`,
      );
    }

    const existingUsername =
      await this.usersRepository.getOneByUsername(username);
    if (existingUsername) {
      throw new ConflictException(
        `User with username: ${username} already registered`,
      );
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await this.usersRepository.insertAndFetchOne({
      username,
      email,
      password: hashedPassword,
    });

    const { access, refresh } = await this.generateTokens({ userId: user.id });

    await this.userRefreshTokensRepository.upsertAndFetchOne({
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  async login(payload: LoginDto): Promise<AuthTokens> {
    const { email, password } = payload;

    const user = await this.usersRepository.getOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with ${email} email does not exist`);
    }

    if (!user.password) {
      throw new BadRequestException('User has not set password yet');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const { access, refresh } = await this.generateTokens({ userId: user.id });

    await this.userRefreshTokensRepository.upsertAndFetchOne({
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  logout(userId: number): Promise<void> {
    return this.userRefreshTokensRepository.deleteOneByUserId(userId);
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const userRefreshToken =
      await this.userRefreshTokensRepository.getOneByUserIdAndToken(
        userId,
        refreshToken,
      );
    if (!userRefreshToken) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    if (dayjs.utc().isAfter(dayjs(userRefreshToken.expiresAt))) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    const user = await this.usersRepository.getOneById(userRefreshToken.userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} id does not exist`);
    }

    const { access, refresh } = await this.generateTokens({ userId: user.id });

    await this.userRefreshTokensRepository.upsertAndFetchOne({
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return {
      access: {
        token: access.token,
        expiresAt: access.expiresAt,
      },
      refresh: {
        token: refresh.token,
        expiresAt: refresh.expiresAt,
      },
    };
  }

  private async generateTokens(payload: {
    userId?: number;
    companyId?: number;
    ownerId?: number;
    adminId?: number;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          ...payload,
          type: AuthTokenType.Access,
        },
        {
          secret: this.authConfig.jwt.access.secret,
          expiresIn: this.authConfig.jwt.access.expiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          ...payload,
          type: AuthTokenType.Refresh,
        },
        {
          secret: this.authConfig.jwt.refresh.secret,
          expiresIn: this.authConfig.jwt.refresh.expiresIn,
        },
      ),
    ]);

    return {
      access: {
        token: accessToken,
        expiresAt: dayjs()
          .add(this.authConfig.jwt.access.expiresIn, 'second')
          .utc()
          .toISOString(),
      },
      refresh: {
        token: refreshToken,
        expiresAt: dayjs()
          .add(this.authConfig.jwt.refresh.expiresIn, 'second')
          .utc()
          .toISOString(),
      },
    };
  }
}

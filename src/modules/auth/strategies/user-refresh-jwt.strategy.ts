import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { getAuthConfig } from 'src/common/configs/auth.config';
import { AuthTokenType } from 'src/common/constants/auth-token-type';

@Injectable()
export class UserRefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'user-refresh-jwt',
) {
  constructor(private readonly jwtService: JwtService) {
    const authConfig = getAuthConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.refresh.secret,
      passReqToCallback: true,
    });
  }

  validate(
    request: Request,
  ): { userId: number; refreshToken: string } | boolean {
    const token = request.headers['authorization'].replace('Bearer', '').trim();

    if (
      !token ||
      !this.jwtService.verify(token, {
        secret: getAuthConfig().jwt.refresh.secret,
      })
    ) {
      return false;
    }

    const userId = this.jwtService.decode(token)['userId'];
    const type = this.jwtService.decode(token)['type'];
    if (!userId || !type) {
      return false;
    }

    if (type !== AuthTokenType.Refresh) {
      return false;
    }

    return { refreshToken: token, userId: +userId };
  }
}

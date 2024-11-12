import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getAuthConfig } from 'src/common/configs/auth.config';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenType } from 'src/common/constants/auth-token-type';

@Injectable()
export class UserAccessJwtStrategy extends PassportStrategy(
  Strategy,
  'user-access-jwt',
) {
  constructor(private readonly jwtService: JwtService) {
    const authConfig = getAuthConfig();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwt.access.secret,
      passReqToCallback: true,
    });
  }

  validate(request: Request): { userId: number } | boolean {
    const token = request.headers['authorization'].replace('Bearer', '').trim();

    if (
      !token ||
      !this.jwtService.verify(token, {
        secret: getAuthConfig().jwt.access.secret,
      })
    ) {
      return false;
    }

    const { userId, type } = this.jwtService.decode(token);

    if (!userId || !type) {
      return false;
    }

    if (type !== AuthTokenType.Access) {
      return false;
    }

    return { userId: +userId };
  }
}

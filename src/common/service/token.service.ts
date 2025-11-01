import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import  { JwtPayload } from 'jsonwebtoken';
import { TokenTypeEnum } from '../enums';
import { UserRepo } from 'src/DB';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService:JwtService,
    private readonly UserRepo : UserRepo
  ) {}

  GenerateToken = async ({
    payload,
    options,
  }: {
    payload: Object;
    options?: JwtSignOptions;
  }): Promise<string> => {
    return this.jwtService.signAsync(payload, options);
  };

  VerifyToken = async ({
    token,
    options
  }: {
    token: string;
    options:JwtVerifyOptions
  }): Promise<JwtPayload> => {
    return this.jwtService.verifyAsync(token,options) as JwtPayload;
  };

  getSegnature = async (
    prefix: string,
    tokenType: TokenTypeEnum = TokenTypeEnum.access,
  ) => {
    if (tokenType === TokenTypeEnum.access) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.ACCESS_TOKEN_USER;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.ACCESS_TOKEN_ADMIN;
      } else {
        return null;
      }
    }
    if (tokenType === TokenTypeEnum.refresh) {
      if (prefix === process.env.BEARER_USER) {
        return process.env.REFRESH_TOKEN_USER;
      } else if (prefix === process.env.BEARER_ADMIN) {
        return process.env.REFRESH_TOKEN_ADMIN;
      } else {
        return null;
      }
    }
    return null;
  };

  decodedTokenAndFeTchUser = async (token: string, signature: string) => {
    const decoded = await this.VerifyToken({ token, options:{secret:signature} });
    if (!decoded) {
      throw new BadRequestException('invalid token');
    }
    const user = await this.UserRepo.findOne({ email: decoded.email });
    if (!user) {
      throw new BadRequestException('user not found');
    }
    if (!user?.confirmed) {
      throw new BadRequestException('please confirmed email first');
    }
    // if (await _revokToken.findOne({ tokenId: decoded?.jti })) {
    //   throw new BadRequestException('token has been revoked');
    // }
    // if (user?.changCredentials?.getTime()! > decoded.iat! * 1000) {
    //   throw new BadRequestException('token has been revoked');
    // }
    return { decoded, user };
  };
}

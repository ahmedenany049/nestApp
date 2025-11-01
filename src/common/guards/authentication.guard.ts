import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { Reflector } from '@nestjs/core';
import { TokenName } from '../decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService:TokenService,
    private reflector: Reflector
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const typeToken = this.reflector.get(TokenName,context.getHandler())
    let req: any;
    let authorization: string = '';
    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req?.headers?.authorization!;
    }
    // else if(context.getType()==="ws"){
    // }else if(context.getType()==="rpc"){
    // }

    try {
      const [prefix, token] = authorization?.split(' ') || [];
      if (!prefix || !token) {
        throw new BadRequestException('token not found');
      }
      const signature = await this.tokenService.getSegnature(
        prefix,
        typeToken,
      );
      if (!signature) {
        throw new BadRequestException('invalid token');
      }
      const { user, decoded } =
        await this.tokenService.decodedTokenAndFeTchUser(token, signature);
      req.user = user;
      req.decoded = decoded;
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

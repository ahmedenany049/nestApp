import {Injectable,CanActivate,ExecutionContext,BadRequestException, UnauthorizedException,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleName } from '../decorators';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try{
            const req = context.switchToHttp().getRequest()
            const access_roles = this.reflector.get(RoleName, context.getHandler());
            if(!access_roles.includes(req.user.role)){
                throw new UnauthorizedException()
            }
            return true;
        }
        catch (error:any) {
            throw new BadRequestException(error.message);
        }
    }
}

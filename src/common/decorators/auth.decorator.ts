
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Token } from './token.decorator';
import { Role } from './role.decorator';
import { TokenTypeEnum, UserRole } from '../enums';
import { AuthenticationGuard } from '../guards';
import { AuthorizationGuard } from '../guards/authorization.guard';

export function Auth({tokenType =TokenTypeEnum.access,role = [UserRole.USER]}:{tokenType?:TokenTypeEnum,role?:UserRole[]}={}) {
    return applyDecorators(
    Token(tokenType),
    Role(role),
    UseGuards(AuthenticationGuard,AuthorizationGuard )
    );
}

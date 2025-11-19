import { Body, Controller,Delete,Param,Patch,Post} from '@nestjs/common';
import { Auth, User } from 'src/common/decorators';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import type{ userDocument } from 'src/DB';
import { createCartDto, paramDto, updateQuantityDto } from './cart.dto';
import { CartService } from './cart.service';

@Controller('Cart')
export class CartController {
    constructor(private readonly CartService:CartService){}


//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Delete(":id")
    async removeProductFromCart(
        @Param() param:paramDto,
        @User() user:userDocument,
    ){
        const Cart = await this.CartService.removeProductFromCart(param.id,user)
        return {message:"done",Cart}
    }

//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Patch(":id")
    async updateProductFromCart(
        @Param() param:paramDto,
        @User() user:userDocument,
        @Body()body:updateQuantityDto
    ){
        const Cart = await this.CartService.updateProductFromCart(param.id,user,body)
        return {message:"done",Cart}
    }

//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Post()
    async createCart(
        @Body() body:createCartDto,
        @User() user:userDocument,
    ){
        const Cart = await this.CartService.createCart(body,user)
        return {message:"done",Cart}
    }
    
}

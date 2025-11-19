import { Body, Controller, Post } from '@nestjs/common';
import { Auth, User } from 'src/common/decorators';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import type{ userDocument } from 'src/DB';

import { CouponService } from './coupon.service';
import { createCouponDto } from './coupon.dto';

@Controller('coupon')
export class CouponController {
    constructor(private readonly CouponService:CouponService){}


//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Post()
    async createCoupon(
        @Body() CouponDto:createCouponDto,
        @User() user:userDocument,
    ){
        const Coupon = await this.CouponService.createCoupon(CouponDto,user)
        return {message:"done",Coupon}
    }
    
}

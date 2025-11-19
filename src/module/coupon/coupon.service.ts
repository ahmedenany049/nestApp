import {  ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import { CouponRepo, userDocument } from 'src/DB';
import { createCouponDto } from './coupon.dto';

@Injectable()
export class CouponService {
    constructor(
        private readonly _CouponRepo:CouponRepo,
    ){}
    async createCoupon (
        body:createCouponDto,
        user:userDocument,
    ){
        const {code,amount,fromDate,toDate}= body
        const couponExist = await this._CouponRepo.findOne({
            filter:{code:code.toLowerCase()}
        })
        if(couponExist){
            throw new ConflictException("coupon already exist")
        }
        const Coupon = await this._CouponRepo.create({
            code,
            amount,
            fromDate,
            toDate,
            createdBy:user._id
        })
        if(!Coupon){
            throw new InternalServerErrorException("coupon not created")
        }
        return Coupon
    }
}
    



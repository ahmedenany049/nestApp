import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { CouponModel, CouponRepo, UserModel, UserRepo } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

@Module({
  imports:[UserModel,CouponModel],
  controllers: [CouponController],
  providers: [CouponService,TokenService,JwtService,UserRepo,CouponRepo,S3service]
})
export class CouponModule {}

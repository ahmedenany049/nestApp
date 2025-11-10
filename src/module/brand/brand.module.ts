import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { BrandModel, BrandRepo, UserModel, UserRepo } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';

@Module({
  imports:[UserModel,BrandModel],
  controllers: [BrandController],
  providers: [BrandService,TokenService,JwtService,UserRepo,BrandRepo,S3service]
})
export class BrandModule {}

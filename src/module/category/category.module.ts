import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { BrandModel,  BrandRepo,  categoryModel,  categoryRepo,  UserModel, UserRepo } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';
import { categoryController } from './category.controller';
import { categoryService } from './category.service';

@Module({
  imports:[UserModel,BrandModel,categoryModel],
  controllers: [categoryController],
  providers: [categoryService,TokenService,JwtService,UserRepo,categoryRepo,S3service,BrandRepo]
})
export class CategoryModule {}

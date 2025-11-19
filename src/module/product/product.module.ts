import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { BrandRepo, categoryRepo, ProductRepo, UserRepo} from 'src/DB/repositories';
import {  BrandModel, categoryModel, ProductModel, UserModel, } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports:[UserModel,ProductModel,BrandModel,categoryModel],
  controllers: [ProductController],
  providers: [ProductService,TokenService,JwtService,UserRepo,S3service,categoryRepo,BrandRepo,ProductRepo]
})
export class ProductModule {}

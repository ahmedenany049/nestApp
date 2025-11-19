import { Module } from '@nestjs/common';
import { TokenService } from 'src/common/service/token.service';
import { JwtService } from '@nestjs/jwt';
import { ProductRepo, UserRepo} from 'src/DB/repositories';
import { CartModel, ProductModel, UserModel } from 'src/DB';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepo } from 'src/DB/repositories/cart.rebo';


@Module({
  imports:[UserModel,CartModel,ProductModel],
  controllers: [CartController],
  providers: [CartService,TokenService,JwtService,UserRepo,CartRepo,ProductRepo]
})
export class CartModule {}

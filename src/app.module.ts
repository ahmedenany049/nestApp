import {  Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { BrandModule } from './module/brand/brand.module';
import { CategoryModule } from './module/category/category.module';
import { ProductModule } from './module/product/product.module';
import { CartModule } from './module/cart/cart.module';
import { CouponModule } from './module/coupon/coupon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'./config/.env',
      isGlobal:true
    }),
    MongooseModule.forRoot(process.env.MONGOO_URL as string,{
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log(`db conected sucssefully on ${process.env.MONGOO_URL}`));
        return connection;}
      }),
      UserModule,
      BrandModule,
      CategoryModule,
      ProductModule,
      CartModule,
      CouponModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

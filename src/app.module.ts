import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';

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
      UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

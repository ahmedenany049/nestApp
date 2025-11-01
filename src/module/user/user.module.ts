import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { OtpModel, UserModel, UserRepo } from "src/DB";
import { OtpRepo } from "src/DB/repositories/otp.repo";
import { TokenService } from "src/common/service/token.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports:[UserModel,OtpModel],
    controllers:[UserController],
    providers:[UserService,UserRepo,JwtService,OtpRepo,TokenService],
    exports:[]
})

export class UserModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //     .apply(tokenType(),AuthenticationMiddleWare)
    //     .forRoutes(UserController);
    // }
}
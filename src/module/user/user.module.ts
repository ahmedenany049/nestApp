import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { OtpModel, UserModel, UserRepo } from "src/DB";
import { OtpRepo } from "src/DB/repositories/otp.repo";

@Module({
    imports:[UserModel,OtpModel],
    controllers:[UserController],
    providers:[UserService,UserRepo,OtpRepo],
    exports:[]
})

export class UserModule {}
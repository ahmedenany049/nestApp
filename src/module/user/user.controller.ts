import { Body, Controller, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { AddUserDto, addUserQueryDto, confirmEmailDto, logInDto } from "./dto/add_user.dto";

@Controller('users')
export class UserController {
    constructor(private readonly userService:UserService){}
    @Post("signUp")
    @UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,stopAtFirstError:true,}))
    addUser(
        @Body()body:AddUserDto,
    ){
        return this.userService.addUsers(body)
    }
    @Patch("confirm")
    @UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,stopAtFirstError:true,}))
    confirmEmail(
        @Body()body:confirmEmailDto,
    ){
        return this.userService.confirmEmail(body)
    }

    //==================================================================================
    @Post("logIn")
    @UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,stopAtFirstError:true,}))
    logIn(
        @Body()body:logInDto,
    ){
        return this.userService.logIn(body)
    }
}
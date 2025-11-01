import { Body, Controller, Get, Patch, Post, Request, SetMetadata, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { AddUserDto,  confirmEmailDto, logInDto, reSendOtpDto } from "./dto/add_user.dto";
import {  UserRole } from "src/common/enums";
import { Role, Token, User } from "src/common/decorators";
import { AuthorizationGuard } from "src/common/guards/authorization.guard";
import { AuthenticationGuard } from "src/common/guards";
import type { UserWithRrequest } from "src/common/interFaces";

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
    //========================================================================================
    @Post("reSendOtp")
    @UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,stopAtFirstError:true,}))
    reSendOtp(
        @Body()body:reSendOtpDto,
    ){
        return this.userService.reSendOtp(body)
    }
    //==========================================================================================
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

    @Token()
    @Role([UserRole.USER])
    @UseGuards(AuthenticationGuard,AuthorizationGuard)
    @Get("profile")
    profile(
        @User() user:UserWithRrequest,
    ){
        return {message:"profile",user}
    }
}
import {  Body, Controller, Get, ParseFilePipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { AddUserDto,  confirmEmailDto, logInDto, reSendOtpDto } from "./dto/add_user.dto";
import {  storageEnum, TokenTypeEnum, UserRole } from "src/common/enums";
import { User } from "src/common/decorators";
import type { UserWithRrequest } from "src/common/interFaces";
import { FileInterceptor} from "@nestjs/platform-express";
import { fileValidation, multerCloud } from "src/common/service/utils/multer";
import type { userDocument } from "src/DB";
import { Auth } from "src/common/decorators/auth.decorator";

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

    @Auth()
    @Get("profile")
    profile(
        @User() user:UserWithRrequest,
    ){
        return {message:"profile",user}
    }

    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Post('upload')
    @UseInterceptors(FileInterceptor("attachment",multerCloud({fileTypes:fileValidation.image})))
    async uploadFile(@UploadedFile() file:Express.Multer.File,@User() user:userDocument) {
        const url = await this.userService.uploadFile(file,user)
        return {message:"done",url}
    }
}
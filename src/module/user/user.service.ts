import {  BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AddUserDto, confirmEmailDto, logInDto } from "./dto/add_user.dto";
import { UserRepo } from "src/DB";
import { OtpEnum, UserGender, UserRole } from "src/common/enums";
import { emailTemplate, sendEmail } from "src/common/service";
import { OtpRepo } from "src/DB/repositories/otp.repo";
import { Compare } from "src/common/helpers/compares/compare";
import { GenerateToken } from "src/common/helpers/tokens/tokens";

export class AppError extends HttpException{
    constructor(message:string,status:HttpStatus){
        super(message,status)
    }
}

@Injectable()
export class UserService {
    constructor(private readonly userRepo:UserRepo,private readonly OtpRepo:OtpRepo){}
    async addUsers(body:AddUserDto){
        const {email,password,age,fName,lName,userName,gender} =body 
        const userExist = await this.userRepo.findOne({email:body.email})
        if(userExist){
            throw new BadRequestException("user already exist")
        } 
        const user = await this.userRepo.create({
            email,
            password,
            age,
            fName,
            lName,
            userName,
            gender:gender?(gender as UserGender):UserGender.MALE,
        })
        if(!user){
            throw new ForbiddenException("user not creaqted")
        }
        await sendEmail({to:email,subject:"confirm eamil",html:emailTemplate("123456","confirmEmail")})
        await this.OtpRepo.create({
            code:"123456",
            createdBt:user._id,
            type:OtpEnum.CONFIRM_EMAIL,
            expireAt:new Date(Date.now()+60*1000)
        })
        return user
    }

    //==========================================================
    async confirmEmail(body:confirmEmailDto){
        const {email,code} =body 
        const user = await this.userRepo.findOne({
            filter:{
                email,
                confirmed:{$exists:false}
            },
            options:{
                populate:{
                    path:"otp"
                }
            }
        })
        if(!user){
            throw new BadRequestException("user not exist")
        } 
        if(!await Compare({plainText:code, hash:(user.otp as any)[0].code})){
            throw new BadRequestException("invalid otp")
        }
        user.confirmed = true
        await user.save()
        await this.OtpRepo.deleteOne({filter:{createdBt:user._id}})      
        return {message:"otp sent successfully"}
    }

    //==========================================================
    async logIn(body:logInDto){
        const {email,password} =body 
        const user = await this.userRepo.findOne({
            filter:{
                email,
                confirmed:{$exists:true}
            },
            options:{
                populate:{
                    path:"otp"
                }
            }
        })
        if(!user){
            throw new BadRequestException("user not exist")
        } 
        if(!await Compare({plainText:password, hash:user.password})){
            throw new BadRequestException("invalid password")
        }
        const access_token = await GenerateToken({
            payload:{userId:user._id},
            signature:user.role === UserRole.USER?process.env.ACCESS_TOKEN_USER!:process.env.ACCESS_TOKEN_ADMIN!,
            options:{expiresIn:"1d"}
        })   
        const refresh_token = await GenerateToken({
            payload:{userId:user._id},
            signature:user.role === UserRole.USER?process.env.REFRESH_TOKEN_USER!:process.env.REFRESH_TOKEN_ADMIN!,
            options:{expiresIn:"1d"}
        })   

        return {message:"done",access_token,refresh_token}
    }
}
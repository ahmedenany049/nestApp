import {  IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length, Matches, Min, ValidateIf } from "class-validator";
import { IsMatch } from "src/common/decorators";


export class AddUserDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3,15)
    fName:string;
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(3,15)
    lName:string;

    @IsString()
    @IsNotEmpty()
    @Length(3,15)
    userName:string;

    @IsString()
    @IsNotEmpty()
    gender:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
    
    @IsNotEmpty()
    @Min(18)
    age:number;

    @IsStrongPassword()
    @IsNotEmpty()
    password:string;

    @ValidateIf((data:AddUserDto)=>{
        return Boolean(data.password)
    })
    @IsMatch(["password"])
    cPassword:string;
}

export class addUserQueryDto {
    @IsString()
    @IsNotEmpty()
    flage:string;
}
export class confirmEmailDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{6}$/)
    code:string;
    @IsEmail()
    email
}
export class logInDto {
    @IsStrongPassword()
    @IsNotEmpty()
    password:string;
    @IsEmail()
    @IsNotEmpty()
    email:string;
}

export class reSendOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email:string;
}

import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {  IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators";

export class createBrandDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsNotEmpty()
    name:string

    @IsString()
    @MinLength(3)
    @MaxLength(10)
    @IsNotEmpty()
    slogan:string
}
export class idDto {
    @IsNotEmpty()
    @IsMongoId()
    id:Types.ObjectId
}


@AtLeastOne(["name","slogan"])
export class updateBrandDto extends PartialType(createBrandDto){
}

export class queryDto{
    @IsOptional()
    @IsNumber()
    @Type(()=>Number)
    page:number

    @Type(()=>Number)
    @IsOptional()
    @IsNumber()
    limit:number

    @IsOptional()
    @IsString()
    search:string
}
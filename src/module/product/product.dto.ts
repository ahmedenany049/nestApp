import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {   IsMongoId, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators";


export class createProductDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsNotEmpty()
    name:string

    @IsString()
    @MinLength(3)
    @MaxLength(10000)
    @IsNotEmpty()
    description:string

    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    price:number

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(()=>Number)
    quantity:number

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Type(()=>Number)
    stock:number

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    @Type(()=>Number)
    discount:number

    @IsMongoId()
    @IsNotEmpty()
    brand:Types.ObjectId

    @IsMongoId()
    @IsNotEmpty()
    category:Types.ObjectId
}

@AtLeastOne(["name","description","brand","price","discount","quantity","stock","category"])
export class updateProductDto extends PartialType(createProductDto){
}


export class paramDto {
    @IsNotEmpty()
    @IsMongoId()
    id:Types.ObjectId
}
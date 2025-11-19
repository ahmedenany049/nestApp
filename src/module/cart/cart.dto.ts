import { Type } from "class-transformer";
import {   IsMongoId, IsNotEmpty, IsNumber } from "class-validator";
import { Types } from "mongoose";


export class createCartDto {

    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    quantity:number

    @IsMongoId()
    @IsNotEmpty()
    productId:Types.ObjectId
}
export class updateQuantityDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    quantity:number

}

export class paramDto {
    @IsNotEmpty()
    @IsMongoId()
    id:Types.ObjectId
}
import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { TokenService } from "../service/token.service";
import { UserWithRrequest } from "../interFaces";
import {  Response, NextFunction } from 'express';
import { TokenTypeEnum } from "../enums";

export const tokenType = (typeToken:TokenTypeEnum=TokenTypeEnum.access)=>{
    return (req: UserWithRrequest, res: Response, next: NextFunction)=> {
        req.typeToken = typeToken
        next();
    };
}



@Injectable()
export class AuthenticationMiddleWare implements NestMiddleware{
    constructor(private readonly tokenService:TokenService){}
    async use(req:UserWithRrequest,res:Response,next:NextFunction){
        try {
            const {authorization}=req.headers
            const [prefix,token]= authorization?.split(" ")||[];
            if(!prefix||!token){
                throw new BadRequestException("token not found")
            }
            const signature = await this.tokenService.getSegnature(prefix,req.typeToken)
            if(!signature){
                throw new BadRequestException("invalid token")
            }
            const {user,decoded} = await this.tokenService.decodedTokenAndFeTchUser(token,signature)
            req.user = user;
            req.decoded = decoded
            return next()
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
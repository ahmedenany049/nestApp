import { TokenTypeEnum } from "../enums"
import { SetMetadata } from "@nestjs/common"
export const TokenName = "tokenType"
export const Token = (typeToken=TokenTypeEnum.access)=>{
    return SetMetadata(TokenName,typeToken)
}